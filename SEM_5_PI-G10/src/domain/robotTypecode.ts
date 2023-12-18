import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface RobotTypeCodeProps {
  code: string;  
}

export class RobotTypeCode extends ValueObject<RobotTypeCodeProps> {
    get code (): string {
        return this.props.code;
    }


    private constructor (props: RobotTypeCodeProps) {
        super(props);
    }

  public static create (props: RobotTypeCodeProps): Result<RobotTypeCode> {
    const guardedProps = [
      { argument: props.code, argumentName: 'code'},
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
  
  
        if (props.code.length < 1 || props.code.length > 50) {
            return Result.fail<RobotTypeCode>('Code must be between 1 and 50 characters.');
        }
        
    
        const robotTypeCode = new RobotTypeCode({
          ...props
        });

      return Result.ok<RobotTypeCode>(robotTypeCode);
    
  }
}
