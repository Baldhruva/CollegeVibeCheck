/**
 * Responsibility: TypeScript interfaces for Rating Parameters.
 * Purpose: Defines database schemas for parameters and sub-parameters.
 * What code will eventually live here: DBParameter, DBSubParameter, and ParameterWithSubParameters interfaces.
 */

export interface DBParameter {
  id: string; // uuid, primary key, default gen_random_uuid()
  name: string; // varchar(100), unique, not null
  description: string | null; // text, nullable
}

export interface DBSubParameter {
  id: string; // uuid, primary key, default gen_random_uuid()
  parameter_id: string; // uuid, not null, foreign key to parameters(id) on delete cascade
  name: string; // varchar(100), not null
}

export interface ParameterWithSubParameters extends DBParameter {
  subParameters: DBSubParameter[];
}
