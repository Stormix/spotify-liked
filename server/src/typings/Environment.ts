import { CleanedEnvAccessors } from 'envalid'

export type Environment = Readonly<Record<string, any> & CleanedEnvAccessors>
