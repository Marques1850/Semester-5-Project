import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface BuildingCodeProps {
  code: string;  
}

export class BuildingCode extends ValueObject<BuildingCodeProps> {
    get code (): string {
        return this.props.code;
    }


    private constructor (props: BuildingCodeProps) {
        super(props);
    }

  public static create (props: BuildingCodeProps): Result<BuildingCode> {
    const guardedProps = [
      { argument: props.code, argumentName: 'code'},
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
  
        if (props.code.length < 1 || props.code.length > 5) {
            return Result.fail<BuildingCode>('Code must be between 1 and 5 characters.');
        }
        
    
        const buildingCode = new BuildingCode({
          ...props
        });

      return Result.ok<BuildingCode>(buildingCode);
    
  }
}
