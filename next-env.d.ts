/// <reference types="next" />
/// <reference types="next/types/global" />

declare module "*.svg" {
  import * as React from "react";

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;
  export default src;
}

type ArrayType<T> = T extends Array<infer U> ? U : T;

// Awesome Reviews Domain Model
module AwesomeReviews {
  type Employee = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };

  type Review = {
    employeeId: number;
    firstName: string;
    lastName: string;
    reviewers: Array<{
      reviewId: number;
      employeeId: number;
      firstName: string;
      lastName: string;
      active: number;
    }>;
  };
}
