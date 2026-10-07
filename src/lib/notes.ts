// Always return a note together with its tags
export const noteInclude = { tags: true } as const;

// Turns ["work", "ideas"] into Prisma's "connect it if it exists, otherwise create it"
export function tagsConnectOrCreate(names: string[]) {
  return names.map((name) => ({
    where: { name },
    create: { name },
  }));
}
