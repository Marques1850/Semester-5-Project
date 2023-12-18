import { when, mock, instance, verify } from 'ts-mockito';
import 'reflect-metadata';
import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { expect } from 'chai';
import IRobotTypeService from '../../../src/services/IServices/IRobotTypeService';
import IRobotTypeRepo from '../../../src/services/IRepos/IRobotTypeRepo';
import RobotTypeService from '../../../src/services/robotTypeService';
import IRobotTypeDTO  from '../../../src/dto/IRobotTypeDTO';
import { RobotTypeMap } from '../../../src/mappers/RobotTypeMap';
import {RobotType} from '../../../src/domain/robotType';
import {RobotTypeCode} from '../../../src/domain/robotTypecode';




describe('RobotTypeService', () => {
    
	let robotTypeRepo: IRobotTypeRepo;
	let robotTypeService: IRobotTypeService;

	beforeEach(function() {
	robotTypeRepo = mock<IRobotTypeRepo>();
    robotTypeService = new RobotTypeService( instance(robotTypeRepo));
  	});

	afterEach(function() {
		//sandbox.restore();
	});
  describe('getRobotTypesByTask', () => {
    it('should return an failure if the robot type is not found', async () => {

       const code="a1f";

      when (robotTypeRepo.findByTaskCode(code)).thenReturn(Promise.resolve([]));

      const result = await robotTypeService.getRobotTypesByTask(code);

      
      expect(result.isFailure).to.be.true;
      expect(result.error).to.equal('No robotTypes found for taskCode=a1f');
     verify(robotTypeRepo.findByTaskCode(code)).once();
    });

    it('should return an array of robot types if found', async () => {
        const code='abc';
      const robotType = RobotType.create({ code:RobotTypeCode.create({code: "1"}).getValue(), description: "Robot", tasksCode:["abc"]  });
      const robottype2 =RobotType.create( { code:RobotTypeCode.create({code: "2"}).getValue(), description: "Robot2", tasksCode: ["abc"] });
      let robotypes: RobotType[] = [];
      robotypes.push(robotType.getValue());
      robotypes.push(robottype2.getValue());
      when (robotTypeRepo.findByTaskCode(code)).thenReturn(Promise.resolve(robotypes));
    

      const Promiseresult = await robotTypeService.getRobotTypesByTask(code);
      const result= Promiseresult.getValue();

   
      expect(Promiseresult.isSuccess).to.be.true;
      expect(result).to.eql([RobotTypeMap.toDTO(robotType.getValue()), RobotTypeMap.toDTO(robottype2.getValue())]);
      verify(robotTypeRepo.findByTaskCode(code)).once();
    });

  });
  describe('createRobotType', function (){
    it('should return an error if the robot type already exists', async () => {
      const robotType = RobotType.create({ code:RobotTypeCode.create({code: "1"}).getValue(), description: "Robot", tasksCode:["abc"]  });
      when (robotTypeRepo.findByCode("1")).thenReturn(Promise.resolve(robotType.getValue()));

      const result = await robotTypeService.createRobotType(RobotTypeMap.toDTO(robotType.getValue()));

      expect(result.isFailure).to.be.true;
      expect(result.error).to.equal('RobotType already exists with code=1');
    });


  });
});