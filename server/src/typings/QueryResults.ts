// This is the raw write result as returned by mongoDB
export interface QueryResults {
  n?: number // The number of documents selected for update
  nModified?: number // The number of documents updated.
  ok?: number // The status of the command.
}
