import { logger } from './logger';

type Validator = (data: any) => boolean;

export class Connector {
  private validators: Validator[];

  constructor(
    private sourceModule: string,
    private targetModule: string
  ) {
    this.validators = [];
    logger.info({ source: sourceModule, target: targetModule }, 'Connector created');
  }

  addValidator(validator: Validator): void {
    this.validators.push(validator);
    logger.debug({ source: this.sourceModule, target: this.targetModule }, 'Validator added');
  }

  private validateData(data: any): boolean {
    return this.validators.every(validator => {
      try {
        return validator(data);
      } catch (error) {
        logger.error({ error, data }, 'Validator error');
        return false;
      }
    });
  }

  transferData(data: any): boolean {
    if (this.validateData(data)) {
      logger.info({ source: this.sourceModule, target: this.targetModule }, 'Data transferred');
      return true;
    }
    logger.warn({ source: this.sourceModule, target: this.targetModule, data }, 'Data transfer failed');
    return false;
  }
}
