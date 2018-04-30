import { check } from 'express-validator/check'
import Joi from 'joi'

export const createStoreValidator = [
    check('commitSha').exists(),
    check('fileDetailsByPath').exists(),
    check('repoBranch').exists(),
    check('repoName').exists(),
    check('repoOwner').exists(),
]

export const lookupStoreValidator = [
    check('repoBranch').exists(),
    check('repoName').exists(),
    check('repoOwner').exists(),
]

export const githubTokenValidator = [check('code').optional()]

const detailsSchema = Joi.object()
    .keys({
        commitSha: Joi.string().required(),
        repoBranchBase: Joi.string().required(),
        repoCurrentBranch: Joi.string().required(),
        repoName: Joi.string().required(),
        repoOwner: Joi.string().required(),
    })
    .required()

const fullResultItemSchema = Joi.object().keys({
    baseBranchSize: Joi.number().required(),
    filePath: Joi.string().required(),
    maxSize: Joi.number().required(),
    message: Joi.string().required(),
    size: Joi.number().required(),
    status: Joi.string().required(),
})

const resultsSchema = Joi.object()
    .keys({
        fullResults: Joi.array()
            .items(fullResultItemSchema)
            .required(),
        status: Joi.string().required(),
        summary: Joi.string().required(),
    })
    .required()

export const unpackedJsonSchema = Joi.object().keys({
    details: detailsSchema,
    results: resultsSchema,
})
