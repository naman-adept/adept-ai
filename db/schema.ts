import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// External Job Platforms
export const jobPlatforms = pgTable("job_platforms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  apiIntegrationToken: text("api_integration_token").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Jobs Table
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  platformId: integer("platform_id").notNull(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location"),
  salaryRange: text("salary_range"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Applicants Table
export const applicants = pgTable("applicants", {
  id: serial("id").primaryKey(),
  platformId: integer("platform_id").notNull(),
  name: text("name").notNull(),
  email: text("email").unique(),
  phone: text("phone"),
  resume: text("resume"), // Path to resume file
  skills: text("skills"), // Comma-separated skills
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Job Applications Table
export const jobApplications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  applicantId: integer("applicant_id").notNull(),
  jobId: integer("job_id").notNull(),
  platformId: integer("platform_id").notNull(),
  status: text("status").notNull().default("applied"), // applied, shortlisted, rejected, etc.
  appliedAt: timestamp("applied_at").defaultNow(),
});

// Sync Logs Table
export const syncLogs = pgTable("sync_logs", {
  id: serial("id").primaryKey(),
  platformId: integer("platform_id").notNull(),
  syncType: text("sync_type").notNull(), // "jobs" or "applicants"
  syncStatus: text("sync_status").notNull(), // success, failure
  message: text("message"), // Details of the sync process
  createdAt: timestamp("created_at").defaultNow(),
});

// Matchmaking Scores Table
export const matchmakingScores = pgTable("matchmaking_scores", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  applicantId: integer("applicant_id").notNull(),
  score: integer("score").notNull(), // Match score
  skillsMatch: text("skills_match"), // Skills matched
  proximityScore: integer("proximity_score"), // Location proximity score
  availabilityScore: integer("availability_score"), // Availability score
  softSkillsScore: integer("soft_skills_score"), // Soft skills alignment
  createdAt: timestamp("created_at").defaultNow(),
});

// Recruiter Preferences Table
export const recruiterPreferences = pgTable("recruiter_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  preferenceKey: text("preference_key").notNull(), // e.g., "location_priority"
  preferenceValue: text("preference_value").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations

// Users -> Jobs
export const usersRelations = relations(users, ({ one, many }) => ({
  jobs: many(jobs),
}));

// Job Platforms -> Jobs
export const jobPlatformsRelations = relations(
  jobPlatforms,
  ({ one, many }) => ({
    jobs: many(jobs),
    applicants: many(applicants),
    syncLogs: many(syncLogs),
  })
);

// Jobs -> Job Applications
export const jobsRelations = relations(jobs, ({ one, many }) => ({
  platform: one(jobPlatforms, {
    fields: [jobs.platformId],
    references: [jobPlatforms.id],
  }),
  user: one(users, {
    fields: [jobs.userId],
    references: [users.id],
  }),
  applications: many(jobApplications),
  matchmakingScores: many(matchmakingScores),
}));

// Applicants -> Job Applications
export const applicantsRelations = relations(applicants, ({ one, many }) => ({
  platform: one(jobPlatforms, {
    fields: [applicants.platformId],
    references: [jobPlatforms.id],
  }),
  applications: many(jobApplications),
  matchmakingScores: many(matchmakingScores),
}));

// Job Applications -> Jobs and Applicants
export const jobApplicationsRelations = relations(
  jobApplications,
  ({ one }) => ({
    job: one(jobs, {
      fields: [jobApplications.jobId],
      references: [jobs.id],
    }),
    applicant: one(applicants, {
      fields: [jobApplications.applicantId],
      references: [applicants.id],
    }),
    platform: one(jobPlatforms, {
      fields: [jobApplications.platformId],
      references: [jobPlatforms.id],
    }),
  })
);

// Matchmaking Scores -> Jobs and Applicants
export const matchmakingScoresRelations = relations(
  matchmakingScores,
  ({ one }) => ({
    job: one(jobs, {
      fields: [matchmakingScores.jobId],
      references: [jobs.id],
    }),
    applicant: one(applicants, {
      fields: [matchmakingScores.applicantId],
      references: [applicants.id],
    }),
  })
);

// Sync Logs -> Job Platforms
export const syncLogsRelations = relations(syncLogs, ({ one }) => ({
  platform: one(jobPlatforms, {
    fields: [syncLogs.platformId],
    references: [jobPlatforms.id],
  }),
}));

// Recruiter Preferences -> Users
export const recruiterPreferencesRelations = relations(
  recruiterPreferences,
  ({ one }) => ({
    user: one(users, {
      fields: [recruiterPreferences.userId],
      references: [users.id],
    }),
  })
);
