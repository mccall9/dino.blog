export const COMMUNITY_TOPICS = [
  "Ideias",
  "Criando",
  "Tecnologia",
  "Descobertas",
  "Perguntas",
];

export const COMMUNITIES = [
  {
    slug: "clube-dos-curiosos",
    name: "Clube dos Curiosos",
    eyebrow: "Comunidade do dino.blog",
    description:
      "Um espaço leve para compartilhar ideias, perguntas, descobertas e coisas que ainda estão sendo construídas.",
    image: "/assets/dino-blog-hero.png",
    imageAlt:
      "Dino investigando uma ideia entre livros, uma lâmpada e pequenos objetos coloridos",
    topics: [...COMMUNITY_TOPICS],
    href: "/community/clube-dos-curiosos",
    status: "active",
  },
];

export function filterCommunities({ query = "", topic = "Todas" } = {}) {
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");

  return COMMUNITIES.filter((community) => {
    const matchesTopic =
      topic === "Todas" || community.topics.includes(topic);
    const searchable = [
      community.name,
      community.eyebrow,
      community.description,
      ...community.topics,
    ]
      .join(" ")
      .toLocaleLowerCase("pt-BR");

    return matchesTopic && (!normalizedQuery || searchable.includes(normalizedQuery));
  });
}

export function getCommunity(slug) {
  return COMMUNITIES.find((community) => community.slug === slug) || null;
}
