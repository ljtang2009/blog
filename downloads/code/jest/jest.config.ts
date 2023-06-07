import { pathsToModuleNameMapper, JestConfigWithTsJest } from 'ts-jest';
import packageJson from './package.json';
import { Config } from '@jest/types';
import fs from 'node:fs';
import path from 'node:path';
import { parse as jsoncParse } from 'jsonc-parser';

// 默认配置
// import { defaults as tsjPreset } from 'ts-jest/presets'
// import { defaultsESM as tsjPreset } from 'ts-jest/presets';
// import { jsWithTs as tsjPreset } from 'ts-jest/presets';
// import { jsWithTsESM as tsjPreset } from 'ts-jest/presets';
// import { jsWithBabel as tsjPreset } from 'ts-jest/presets';
// import { jsWithBabelESM as tsjPreset } from 'ts-jest/presets';

const displayName: Config.DisplayName = {
  name: packageJson.name,
  color: 'blue',
};

function getTsconfig() {
  const tsconfigFilePath = path.resolve(process.cwd(), './tsconfig.json');
  const str = fs.readFileSync(tsconfigFilePath).toString();
  return jsoncParse(str);
}

export default async (): Promise<JestConfigWithTsJest> => {
  const tsconfig = getTsconfig();
  let result: Record<string, any> = {
    preset: 'ts-jest',

    // Paths mapping
    roots: ['<rootDir>'],
    modulePaths: [tsconfig.compilerOptions.baseUrl],
    moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths /* { prefix: '<rootDir>/' } */),

    setupFilesAfterEnv: ['jest-extended/all'],

    displayName,
    maxConcurrency: 100,

    modulePathIgnorePatterns: ['<rootDir>/dist/'],
  };
  if (process.env['SHOW_REPORTS'] === 'Y') {
    result = {
      ...result,
      collectCoverage: true,
      collectCoverageFrom: ['src/**/*.{js,ts}'],
      coverageDirectory: './.test-report/coverage-report',
      reporters: [
        'default',
        [
          'jest-html-reporters',
          {
            publicPath: './.test-report/html-report',
            filename: 'report.html',
            pageTitle: displayName.name,
            openReport: true,
            enableMergeData: true,
            urlForTestFiles: ' ',
          },
        ],
      ],
    };
  }
  return result;
};
