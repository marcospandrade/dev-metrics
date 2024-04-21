import type { Config } from 'jest';

export default async (): Promise<Config> => {
    return {
        roots: ['./src'],
        modulePaths: [],
        preset: 'ts-jest',
        testEnvironment: 'node',
        setupFiles: ['dotenv/config'],
        moduleNameMapper: {
            '^@common/(.*)$': '<rootDir>/src/common/$1',
            '^@shared/(.*)$': '<rootDir>/src/shared/$1',
            '^@modules/(.*)$': '<rootDir>/src/modules/$1',
            '^@core/(.*)$': '<rootDir>/src/core/$1',
            '^@lib/(.*)$': '<rootDir>/src/lib/$1',
        },
        moduleFileExtensions: ['ts', 'js', 'json'],
        testRegex: '.*\\.spec\\.ts$',
        transform: {
            '^.+\\.(t|j)s$': 'ts-jest',
        },
        collectCoverageFrom: ['**/*.(t|j)s'],
        coverageDirectory: 'coverage',
    };
};
