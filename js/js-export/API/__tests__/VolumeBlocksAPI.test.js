/**
 * @license
 * MusicBlocks v3.4.1
 * Copyright (C) 2025 Justin Charles
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

const JSInterface = {
    validateArgs: jest.fn(),
};
global.JSInterface = JSInterface;

const Singer = {
    VolumeActions: {
        getSynthVolume: jest.fn(),
    },
};
global.Singer = Singer;

const VolumeBlocksAPI = require("../VolumeBlocksAPI");

describe("VolumeBlocksAPI", () => {
    let volumeBlocksAPI;

    beforeEach(() => {
        volumeBlocksAPI = new VolumeBlocksAPI();
        volumeBlocksAPI.turIndex = 0;
        volumeBlocksAPI.runCommand = jest.fn().mockResolvedValue("Command executed");
        volumeBlocksAPI.ENDFLOWCOMMAND = "endFlow";
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("doCrescendo calls runCommand with correct arguments", async () => {
        const mockFlow = jest.fn();
        JSInterface.validateArgs.mockReturnValue([50, mockFlow]);

        const result = await volumeBlocksAPI.doCrescendo(50, mockFlow);

        expect(JSInterface.validateArgs).toHaveBeenCalledWith("doCrescendo", [50, mockFlow]);
        expect(volumeBlocksAPI.runCommand).toHaveBeenCalledWith("doCrescendo", ["crescendo", 50, 0]);
        expect(mockFlow).toHaveBeenCalled();
        expect(result).toBe("endFlow");
    });

    test("doDecrescendo calls runCommand with correct arguments", async () => {
        const mockFlow = jest.fn();
        JSInterface.validateArgs.mockReturnValue([30, mockFlow]);

        const result = await volumeBlocksAPI.doDecrescendo(30, mockFlow);

        expect(JSInterface.validateArgs).toHaveBeenCalledWith("doDecrescendo", [30, mockFlow]);
        expect(volumeBlocksAPI.runCommand).toHaveBeenCalledWith("doCrescendo", ["decrescendo", 30, 0]);
        expect(mockFlow).toHaveBeenCalled();
        expect(result).toBe("endFlow");
    });

    test("setRelativeVolume calls runCommand with correct arguments", async () => {
        const mockFlow = jest.fn();
        JSInterface.validateArgs.mockReturnValue([75, mockFlow]);

        const result = await volumeBlocksAPI.setRelativeVolume(75, mockFlow);

        expect(JSInterface.validateArgs).toHaveBeenCalledWith("setRelativeVolume", [75, mockFlow]);
        expect(volumeBlocksAPI.runCommand).toHaveBeenCalledWith("setRelativeVolume", [75, 0]);
        expect(mockFlow).toHaveBeenCalled();
        expect(result).toBe("endFlow");
    });

    test("setSynthVolume calls runCommand with correct arguments", () => {
        JSInterface.validateArgs.mockReturnValue(["synth1", 100]);

        const result = volumeBlocksAPI.setSynthVolume("synth1", 100);

        expect(JSInterface.validateArgs).toHaveBeenCalledWith("setSynthVolume", ["synth1", 100]);
        expect(volumeBlocksAPI.runCommand).toHaveBeenCalledWith("setSynthVolume", ["synth1", 100, 0]);
        expect(result).resolves.toBe("Command executed");
    });

    test("getSynthVolume calls Singer.VolumeActions.getSynthVolume with correct arguments", () => {
        JSInterface.validateArgs.mockReturnValue(["synth1"]);
        Singer.VolumeActions.getSynthVolume.mockReturnValue(80);

        const result = volumeBlocksAPI.getSynthVolume("synth1");

        expect(JSInterface.validateArgs).toHaveBeenCalledWith("getSynthVolume", ["synth1"]);
        expect(Singer.VolumeActions.getSynthVolume).toHaveBeenCalledWith("synth1", 0);
        expect(result).toBe(80);
    });
});
