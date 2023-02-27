export class HighwayValidationError extends Error {
  constructor(public viewMessage?: string) {
    super(
      `A problem occurred while validating 'highway' content: "${
        viewMessage ?? ''
      }"`
    )
  }
}
