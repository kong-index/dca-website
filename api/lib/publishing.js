const crypto = require("node:crypto");

const GITHUB_API = "https://api.github.com";
const IMAGE_TYPES = new Map([
  ["png", "png"],
  ["jpeg", "jpg"],
  ["webp", "webp"],
  ["gif", "gif"]
]);
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const MAX_IMAGES_PER_POST = 8;
const MAX_EMBEDDED_IMAGE_BYTES = 3 * 1024 * 1024;

const sendJson = (response, statusCode, body) => {
  response.status(statusCode).json(body);
};

const parseBody = (request) => {
  if (typeof request.body === "object" && request.body !== null) return request.body;
  if (typeof request.body !== "string") return {};
  try {
    return JSON.parse(request.body);
  } catch {
    return {};
  }
};

const isValidPassword = (candidate, expected) => {
  if (typeof candidate !== "string" || typeof expected !== "string" || !expected) return false;
  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);
  return candidateBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(candidateBuffer, expectedBuffer);
};

const getConfig = () => ({
  token: process.env.GITHUB_TOKEN || "",
  password: process.env.DCA_EDITOR_PASSWORD || "",
  owner: process.env.GITHUB_OWNER || "kong-index",
  repository: process.env.GITHUB_REPOSITORY || "dca-website",
  branch: process.env.GITHUB_BRANCH || "main",
  postsPath: process.env.GITHUB_POSTS_PATH || "content/writing-posts.json"
});

const githubUrl = (config, path) => `${GITHUB_API}/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repository)}/contents/${path.split("/").map(encodeURIComponent).join("/")}`;

const githubRequest = async (config, path, options = {}) => {
  const response = await fetch(githubUrl(config, path), {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${config.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {})
    }
  });
  return response;
};

const readPosts = async (config) => {
  const response = await githubRequest(config, config.postsPath, { method: "GET" });
  if (response.status === 404) return { sha: "", posts: [] };
  if (!response.ok) throw new Error("GitHub에서 공개 글 목록을 읽지 못했습니다.");
  const payload = await response.json();
  const decoded = Buffer.from(String(payload.content || "").replace(/\s/g, ""), "base64").toString("utf8");
  const posts = JSON.parse(decoded);
  return { sha: String(payload.sha || ""), posts: Array.isArray(posts) ? posts : [] };
};

const writeFile = async (config, path, content, message, sha = "") => {
  const body = {
    message,
    content: Buffer.from(content).toString("base64"),
    branch: config.branch
  };
  if (sha) body.sha = sha;
  const response = await githubRequest(config, path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error("GitHub 저장소에 공개 글을 저장하지 못했습니다.");
  return response.json();
};

const normalisePost = (value) => {
  if (!value || typeof value !== "object") return null;
  const title = String(value.title || "").trim();
  const summary = String(value.summary || "").trim();
  const bodyHtml = String(value.bodyHtml || "").trim();
  const id = String(value.id || "").trim();
  const date = String(value.date || "").trim();
  const category = String(value.category || "").trim();
  if (!title || !summary || !bodyHtml || !id || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !category) return null;
  return {
    id: id.replace(/[^a-z0-9-]/gi, "-").replace(/^-+|-+$/g, "").slice(0, 96),
    title,
    summary,
    bodyHtml,
    date,
    category,
    status: "published",
    tags: Array.isArray(value.tags) ? value.tags.map((tag) => String(tag).trim()).filter(Boolean).slice(0, 12) : [],
    updatedAt: new Date().toISOString()
  };
};

const uploadEmbeddedImages = async (config, post) => {
  const pattern = /data:image\/(png|jpeg|webp|gif);base64,([a-z0-9+/=\s]+)/gi;
  const matches = [...post.bodyHtml.matchAll(pattern)];
  if (matches.length > MAX_IMAGES_PER_POST) throw new Error(`한 번에 최대 ${MAX_IMAGES_PER_POST}장까지 공개할 수 있습니다.`);
  const totalImageBytes = matches.reduce((total, match) => total + Buffer.from(match[2].replace(/\s/g, ""), "base64").length, 0);
  if (totalImageBytes > MAX_EMBEDDED_IMAGE_BYTES) throw new Error("공개 이미지의 합계는 글당 3MB 이하만 사용할 수 있습니다.");
  let bodyHtml = post.bodyHtml;
  for (const [index, match] of matches.entries()) {
    const source = match[0];
    const type = match[1].toLowerCase();
    const binary = Buffer.from(match[2].replace(/\s/g, ""), "base64");
    if (!binary.length || binary.length > MAX_IMAGE_BYTES) throw new Error("공개 이미지는 한 장당 2MB 이하만 사용할 수 있습니다.");
    const extension = IMAGE_TYPES.get(type);
    const path = `assets/uploads/writing/${post.id}-${Date.now()}-${index + 1}.${extension}`;
    await writeFile(config, path, binary, `publish: add image for ${post.id}`);
    bodyHtml = bodyHtml.replace(source, `/${path}`);
  }
  return { ...post, bodyHtml };
};

const publishPost = async (post, password) => {
  const config = getConfig();
  if (!config.token || !config.password) throw new Error("Vercel 환경변수가 아직 설정되지 않았습니다.");
  if (!isValidPassword(password, config.password)) throw new Error("운영자 권한을 확인하지 못했습니다.");
  const normalised = normalisePost(post);
  if (!normalised?.id) throw new Error("공개할 글의 필수 정보를 확인하세요.");
  const prepared = await uploadEmbeddedImages(config, normalised);
  const current = await readPosts(config);
  const nextPosts = current.posts.filter((item) => item?.id !== prepared.id);
  nextPosts.push(prepared);
  nextPosts.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  await writeFile(config, config.postsPath, `${JSON.stringify(nextPosts, null, 2)}\n`, `publish: ${prepared.title}`, current.sha);
  return prepared;
};

module.exports = { getConfig, isValidPassword, parseBody, publishPost, sendJson };
