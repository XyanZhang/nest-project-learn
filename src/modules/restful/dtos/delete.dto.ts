// src/modules/restful/dtos/delete.dto.ts

import { DtoValidation } from "@/modules/core/decorators/dto-validation.decorator";
import { toBoolean } from "@/modules/core/helpters";
import { Transform } from "class-transformer";
import { IsUUID, IsDefined, IsBoolean, IsOptional } from "class-validator";

/**
 * 批量删除验证
 */
@DtoValidation()
export class DeleteDto {
    @IsUUID(undefined, {
        each: true,
        message: 'ID格式错误',
    })
    @IsDefined({
        each: true,
        message: 'ID必须指定',
    })
    ids: string[] = [];
}

/**
 * 带软删除的批量删除验证
 */
@DtoValidation()
export class DeleteWithTrashDto extends DeleteDto {
    @Transform(({ value }) => toBoolean(value))
    @IsBoolean()
    @IsOptional()
    trash?: boolean;
}

/**
 * 批量恢复验证
 */
@DtoValidation()
export class RestoreDto {
    @IsUUID(undefined, {
        each: true,
        message: 'ID格式错误',
    })
    @IsDefined({
        each: true,
        message: 'ID必须指定',
    })
    ids: string[] = [];
}