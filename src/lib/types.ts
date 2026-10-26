/** The subset of an invitation that is safe to send to that guest's browser. */
export interface Guest {
  id: string;
  /** Short greeting name, e.g. "Minh". */
  name: string;
  fullName: string;
  personalMessage?: string;
}
