import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface PassageCodeProps {
  code: string;  
}

export class PassageCode extends ValueObject<PassageCodeProps> {
    get code (): string {
        return this.props.code;
    }


    private constructor (props: PassageCodeProps) {
        super(props);
    }

  public static create (props: PassageCodeProps): Result<PassageCode> {
    const guardedProps = [
      { argument: props.code, argumentName: 'code'},
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
    
  
        if (props.code.length < 1 || props.code.length > 5) {
            return Result.fail<PassageCode>('Code must be between 1 and 5 characters.');
        }
        
    
        const passageCode = new PassageCode({
          ...props
        });

      return Result.ok<PassageCode>(passageCode);
    
  }
}
