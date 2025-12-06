import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { getAllVoices, filterVoices, getCategories, getStatistics } from "./voiceService";
import type { TrpcContext } from "./_core/context";

function createMockContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
  return ctx;
}

describe("Voice Service", () => {
  it("should return all 37 voices", () => {
    const voices = getAllVoices();
    expect(voices).toHaveLength(37);
    expect(voices[0]).toHaveProperty("id");
    expect(voices[0]).toHaveProperty("character");
    expect(voices[0]).toHaveProperty("preview_url");
  });

  it("should filter voices by gender", () => {
    const maleVoices = filterVoices("male");
    const femaleVoices = filterVoices("female");
    
    expect(maleVoices.length).toBeGreaterThan(0);
    expect(femaleVoices.length).toBeGreaterThan(0);
    expect(maleVoices.length + femaleVoices.length).toBe(37);
    
    maleVoices.forEach(voice => {
      expect(voice.gender.toLowerCase()).toBe("male");
    });
    
    femaleVoices.forEach(voice => {
      expect(voice.gender.toLowerCase()).toBe("female");
    });
  });

  it("should filter voices by category", () => {
    const adventurerVoices = filterVoices(undefined, "adventurer");
    expect(adventurerVoices.length).toBeGreaterThan(0);
    adventurerVoices.forEach(voice => {
      expect(voice.category).toBe("adventurer");
    });
  });

  it("should filter voices by both gender and category", () => {
    const maleAdventurers = filterVoices("male", "adventurer");
    maleAdventurers.forEach(voice => {
      expect(voice.gender.toLowerCase()).toBe("male");
      expect(voice.category).toBe("adventurer");
    });
  });

  it("should return all categories", () => {
    const categories = getCategories();
    expect(categories.length).toBeGreaterThan(0);
    expect(categories).toContain("adventurer");
    expect(categories).toContain("audiobook-narrator");
  });

  it("should return correct statistics", () => {
    const stats = getStatistics();
    expect(stats.totalVoices).toBe(37);
    expect(stats.languageCount).toBeGreaterThan(0);
    expect(stats.accentCount).toBeGreaterThan(0);
    expect(stats.languages).toBeInstanceOf(Array);
    expect(stats.accents).toBeInstanceOf(Array);
  });

  it("should include avatar and traits for each voice", () => {
    const voices = getAllVoices();
    voices.forEach(voice => {
      expect(voice.avatar).toBeDefined();
      expect(voice.traits).toBeDefined();
      expect(voice.traits).toBeInstanceOf(Array);
      expect(voice.traits!.length).toBeGreaterThan(0);
    });
  });
});

describe("Voice tRPC Procedures", () => {
  const ctx = createMockContext();
  const caller = appRouter.createCaller(ctx);

  it("voices.list should return all voices", async () => {
    const result = await caller.voices.list();
    expect(result.success).toBe(true);
    expect(result.voices).toHaveLength(37);
    expect(result.total).toBe(37);
  });

  it("voices.filter should filter by gender", async () => {
    const result = await caller.voices.filter({ gender: "male" });
    expect(result.success).toBe(true);
    expect(result.voices.length).toBeGreaterThan(0);
    expect(result.total).toBe(result.voices.length);
    result.voices.forEach((voice: any) => {
      expect(voice.gender.toLowerCase()).toBe("male");
    });
  });

  it("voices.filter should filter by category", async () => {
    const result = await caller.voices.filter({ category: "adventurer" });
    expect(result.success).toBe(true);
    expect(result.voices.length).toBeGreaterThan(0);
    result.voices.forEach((voice: any) => {
      expect(voice.category).toBe("adventurer");
    });
  });

  it("voices.categories should return all categories", async () => {
    const result = await caller.voices.categories();
    expect(result.success).toBe(true);
    expect(result.categories.length).toBeGreaterThan(0);
  });

  it("voices.statistics should return correct stats", async () => {
    const result = await caller.voices.statistics();
    expect(result.success).toBe(true);
    expect(result.stats.totalVoices).toBe(37);
    expect(result.stats.languageCount).toBeGreaterThan(0);
  });

  it("voices.byId should return specific voice", async () => {
    const result = await caller.voices.byId("elv-001");
    expect(result.success).toBe(true);
    expect(result.voice.id).toBe("elv-001");
    expect(result.voice.character).toBeDefined();
  });

  it("voices.byId should throw error for invalid id", async () => {
    await expect(caller.voices.byId("invalid-id")).rejects.toThrow("Voice not found");
  });
});
