import { expect, describe, test, jest, beforeEach } from '@jest/globals'
import { JSDOM } from 'jsdom';
import View from './../../../public/controller/js/view.js';

describe('#View - test swite for presentation layer', () => {
    const dom = new JSDOM();
    global.document =  dom.window.document;
    global.window = dom.window;

    function makeBtnElement({
        text,
        classList
    } = {
        text: '',
        classList: {
            add: jest.fn(),
            remove: jest.fn()
        }
    }) {
        return {
            onclick: jest.fn(),
            classList,
            innerText: text
        }
    };

    beforeEach(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();

        jest.spyOn(
            document,
            "getElementById"
        ).mockReturnValue(makeBtnElement());

    });

    test('#changeCommandBtnsVisibility - given hide=true it should add unassingned class and reset onClick', async () => {
        const view = new View();
        const btns = makeBtnElement();
        
        jest.spyOn(
            document,
            "querySelectorAll"
        ).mockReturnValue([ btns ]);

        view.changeCommandBtnsVisibility()

        expect(btns.classList.add).toHaveBeenCalledWith('unassigned');
        expect(btns.onclick.name).toStrictEqual('onClickReset');
        expect(() => btns.onclick()).not.toThrow();

    });

    test('#changeCommandBtnsVisibility - given hide=false it should add unassingned class and reset onClick', async () => {
        const view = new View();
        const btns = makeBtnElement();
        
        jest.spyOn(
            document,
            "querySelectorAll"
        ).mockReturnValue([ btns ]);

        view.changeCommandBtnsVisibility(false)

        expect(btns.classList.add).not.toHaveBeenCalled();
        expect(btns.classList.remove).toHaveBeenCalledWith('unassigned');
        expect(btns.onclick.name).toStrictEqual('onClickReset');
        expect(() => btns.onclick()).not.toThrow();

    });

    test('#onLoad', () => {
        const view = new View()
        jest.spyOn(
            view,
            view.changeCommandBtnsVisibility.name
        ).mockReturnValue();

        view.onLoad();

        expect(view.changeCommandBtnsVisibility).toHaveBeenCalled();
    });
    
});