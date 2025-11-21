import { IsString, IsNumber, IsEmail } from 'class-validator';

/**
 * Sample DTO for testing - User Created
 */
export class UserCreatedDto {
  @IsString()
  userId: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;
}

/**
 * Sample DTO for testing - Order Placed
 */
export class OrderPlacedDto {
  @IsString()
  orderId: string;

  @IsString()
  userId: string;

  @IsNumber()
  amount: number;
}

/**
 * Invalid DTO for validation testing - missing required decorators
 */
export class InvalidDto {
  // No validation decorators - should fail validation
  data: any;
}

/**
 * DTO with validation that will fail
 */
export class StrictValidationDto {
  @IsEmail()
  email: string;

  @IsNumber()
  age: number;
}
