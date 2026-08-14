export interface ImportRun {
  id: string;
  source_id: string;
  started_at: string;
  completed_at?: string | null;
  status: 'running' | 'completed' | 'failed';
  records_fetched: number;
  records_created: number;
  records_updated: number;
  records_unchanged: number;
  records_conflicted: number;
  records_skipped: number;
  errors?: string[];
  created_at?: string;
}

export interface ImportSummaryReport {
  sourcesProcessed: number;
  recordsFetched: number;
  charactersCreated: number;
  charactersMatched: number;
  charactersDuplicates: number;
  charactersNeedsReview: number;
  fieldsConsensus: number;
  fieldsSourced: number;
  fieldsConflicts: number;
  fieldsMissing: number;
  errorsCount: number;
  imagesAvailable: number;
  imagesMissing: number;
  timestamp: string;
}
