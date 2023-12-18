import { when, mock, instance, verify } from 'ts-mockito';
import 'reflect-metadata';
import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container, Inject } from 'typedi';
import { expect } from 'chai';
import config from "../../../config";
import { Result } from '../../../src/core/logic/Result';
import IUserRepo from '../../../src/services/IRepos/IUserRepo';
import IRoleRepo from '../../../src/services/IRepos/IRoleRepo';
import IUserService from '../../../src/services/IServices/IUserService';
import UserService from '../../../src/services/userService';
import { IUserDTO } from '../../../src/dto/IUserDTO';
import { User } from '../../../src/domain/user';
import { UserEmail } from '../../../src/domain/userEmail';
import { UserPassword } from '../../../src/domain/userPassword';
import { Role } from '../../../src/domain/role';
import IRoleDTO from '../../../src/dto/IRoleDTO';
import exp from 'constants';


describe('UserService', function () {
	let userRepo: IUserRepo;
	let roleRepo: IRoleRepo;
	let userService: IUserService;

	beforeEach(function () {
		userRepo = mock<IUserRepo>();
		roleRepo = mock<IRoleRepo>();
		userService = new UserService(instance(userRepo), instance(roleRepo), "" );
	});

	afterEach(function () {
		//sandbox.restore();
	});

	describe('createUser', async function () {
		it('should return error when invalid email', async function () {
			// Arrange
			const userDTO :IUserDTO= {
                firstName: "etste",
                lastName: "sadas",
                phoneNumber: "9123123",
                email: "asdasd",
                password: "saddasas",
                role: "asdasd",
                estado:"aprovado"
            };
			// Act
			const result = await userService.createUser(userDTO);

			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.errorValue()).to.equal("Invalid Email");
		});

		it('should return a failure result when already exists that user', async function () {
			const userDTO :IUserDTO= {
                firstName: "etste",
                lastName: "sadas",
                phoneNumber: "9123123",
                email: "asdasd@isep.ipp.pt",
                password: "saddasas",
                role: "asdasd",
                estado:"aprovado"
            };
            const roleDTO :IRoleDTO= {
                id: "asdasd",
                name: "asdasd"
            };
            const user = User.create({
                firstName: userDTO.firstName,
                lastName: userDTO.lastName,
                phoneNumber: userDTO.phoneNumber,
                email: UserEmail.create(userDTO.email).getValue(),
                password: UserPassword.create({value: userDTO.password, hashed: false}).getValue(),
                role: Role.create( roleDTO).getValue(),
                estado: userDTO.estado
            }).getValue();

			when(userRepo.findByEmail(userDTO.email)).thenReturn(Promise.resolve(user));
			// Act
			const result = await userService.createUser(userDTO);

			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.errorValue()).to.equal("User already exists.");
		});
	

	it('should return a failure result when the role doesnt exist', async function () {
		const userDTO :IUserDTO= {
            firstName: "etste",
            lastName: "sadas",
            phoneNumber: "9123123",
            email: "asdasd@isep.ipp.pt",
            password: "saddasas",
            role: "asdasd",
            estado:"aprovado"
        };
        const roleDTO :IRoleDTO= {
            id: "asdasd",
            name: "asdasd"
        };
        const user = User.create({
            firstName: userDTO.firstName,
            lastName: userDTO.lastName,
            phoneNumber: userDTO.phoneNumber,
            email: UserEmail.create(userDTO.email).getValue(),
            password: UserPassword.create({value: userDTO.password, hashed: false}).getValue(),
            role: Role.create( roleDTO).getValue(),
            estado: userDTO.estado
        }).getValue();

        when(userRepo.findByEmail(userDTO.email)).thenReturn(Promise.resolve(null));
        when(roleRepo.findByName(userDTO.role)).thenReturn(Promise.resolve(null));
        // Act
        const result = await userService.createUser(userDTO);

        // Assert
        expect(result.isFailure).to.be.true;
        expect(result.errorValue()).to.equal("Role not found");
	});

	it('should return a failure result when the password doesnt match the requirements', async function () {
		const userDTO :IUserDTO= {
            firstName: "etste",
            lastName: "sadas",
            phoneNumber: "9123123",
            email: "asdasd@isep.ipp.pt",
            password: "saddasas",
            role: "asdasd",
            estado:"aprovado"
        };
        const roleDTO :IRoleDTO= {
            id: "asdasd",
            name: "asdasd"
        };
        const roletest = Role.create( roleDTO).getValue();
        const user = User.create({
            firstName: userDTO.firstName,
            lastName: userDTO.lastName,
            phoneNumber: userDTO.phoneNumber,
            email: UserEmail.create(userDTO.email).getValue(),
            password: UserPassword.create({value: userDTO.password, hashed: false}).getValue(),
            role: roletest,
            estado: userDTO.estado
        }).getValue();

        when(userRepo.findByEmail(userDTO.email)).thenReturn(Promise.resolve(null));
        when(roleRepo.findByName(userDTO.role)).thenReturn(Promise.resolve(roletest));
        // Act
        const result = await userService.createUser(userDTO);

        // Assert
        expect(result.isFailure).to.be.true;
        expect(result.errorValue()).to.equal("Password must have at least 10 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 symbol [@#%]");
	});

	it('should return a succes result when the user parameters are valid', async function () {
		const userDTO :IUserDTO= {
            firstName: "etste",
            lastName: "sadas",
            phoneNumber: "9123123",
            email: "asdasd@isep.ipp.pt",
            password: "aAsasdasdas10@sad",
            role: "asdasd",
            estado:"aprovado"
        };
        const roleDTO :IRoleDTO= {
            id: "asdasd",
            name: "asdasd"
        };
        const roletest = Role.create( roleDTO).getValue();
        const user = User.create({
            firstName: userDTO.firstName,
            lastName: userDTO.lastName,
            phoneNumber: userDTO.phoneNumber,
            email: UserEmail.create(userDTO.email).getValue(),
            password: UserPassword.create({value: userDTO.password, hashed: false}).getValue(),
            role: roletest,
            estado: userDTO.estado
        }).getValue();

        when(userRepo.findByEmail(userDTO.email)).thenReturn(Promise.resolve(null));
        when(roleRepo.findByName(userDTO.role)).thenReturn(Promise.resolve(roletest));
        when(userRepo.save(user)).thenReturn(Promise.resolve(user));
        // Act
        const result = await userService.createUser(userDTO);

        // Assert
        expect(result.isSuccess).to.be.true;
        expect(result.getValue().email).to.equal(userDTO.email);
        expect(result.getValue().firstName).to.equal(userDTO.firstName);
        expect(result.getValue().lastName).to.equal(userDTO.lastName);
        expect(result.getValue().phoneNumber).to.equal(userDTO.phoneNumber);
	});
    });
    describe('downloadUserData', async function () {
        it('should return a failure result when the email doesnt exist', async function () {
            let email = "asdasd@isep.ipp.pt";

            when(userRepo.findByEmail(email)).thenReturn(Promise.resolve(null));

            const result = await userService.downloadUserData(email);

            expect(result.isFailure).to.be.true;
            expect(result.errorValue()).to.equal("User not found");
        });

        it('should return a failure result when role of the user is from a backoffice user', async function () {
            const userDTO :IUserDTO= {
                firstName: "etste",
                lastName: "sadas",
                phoneNumber: "9123123",
                email: "asdasd@isep.ipp.pt",
                password: "aAsasdasdas10@sad",
                role: "Admin",
                estado:"aprovado"
            };
            const roleDTO :IRoleDTO= {
                id: "asdasd",
                name: "asdasd"
            };
            const roletest = Role.create( roleDTO).getValue();
            const user = User.create({
                firstName: userDTO.firstName,
                lastName: userDTO.lastName,
                phoneNumber: userDTO.phoneNumber,
                email: UserEmail.create(userDTO.email).getValue(),
                password: UserPassword.create({value: userDTO.password, hashed: false}).getValue(),
                role: roletest,
                estado: userDTO.estado
            }).getValue();
            when(userRepo.findByEmail(userDTO.email)).thenReturn(Promise.resolve(user));

            const result = await userService.downloadUserData(userDTO.email);

            expect(result.isFailure).to.be.true;
            expect(result.errorValue()).to.equal("User is a backoffice user");
        });

        it('should return a succes result when the user parameters are valid', async function () {
            const userDTO :IUserDTO= {
                firstName: "etste",
                lastName: "sadas",
                phoneNumber: "9123123",
                email: "asdasd@isep.ipp.pt",
                password: "aAsasdasdas10@sad",
                role: "User",
                estado:"aprovado"
            };
            const roleDTO :IRoleDTO= {
                id: "asdasd",
                name: "User"
            };
            const roletest = Role.create( roleDTO).getValue();
            const user = User.create({
                firstName: userDTO.firstName,
                lastName: userDTO.lastName,
                phoneNumber: userDTO.phoneNumber,
                email: UserEmail.create(userDTO.email).getValue(),
                password: UserPassword.create({value: userDTO.password, hashed: false}).getValue(),
                role: roletest,
                estado: userDTO.estado
            }).getValue();
            when(userRepo.findByEmail(userDTO.email)).thenReturn(Promise.resolve(user));

            const result = await userService.downloadUserData(userDTO.email);

            expect(result.isSuccess).to.be.true;
            expect(result.getValue().email).to.equal(userDTO.email);
            expect(result.getValue().firstName).to.equal(userDTO.firstName);
            expect(result.getValue().lastName).to.equal(userDTO.lastName);
            expect(result.getValue().phoneNumber).to.equal(userDTO.phoneNumber);
        });
    });


});



