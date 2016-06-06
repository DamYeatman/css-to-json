'use babel';

import CssToJsonView from './css-to-json-view';
import { CompositeDisposable } from 'atom';

export default {

    cssToJsonView: null,
    modalPanel: null,
    subscriptions: null,

    activate(state) {
        // Events subscriHello Worldbed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'css-to-json:toggle': () => this.toggle()
        }));
    },

    deactivate() {
        this.subscriptions.dispose();
    },

    css(css) {
        let parsed = ''

        // remove comments
        css = css.replace(/\/\/.+\n/g, '');
        css = css.replace(/\/\*(.|\n)*?\*\//g, '');

        // set value on multiple lines to appear on the same line
        css = css.replace(/,(\s+)?\n(\s+)?/g,', ').trim()

        // split CSS rules.
        let cssSplit = css.replace(/\n/g, ';').split(';')

        // remove empty values
        cssSplit = cssSplit.filter((value) => value);

        // loop over CSS values
        for (index in cssSplit) {
            // split on :
            const cssVals = cssSplit[index].split(':');

            // convert to camelCase
            const name = cssVals[0].replace(/-\w/g, (x) => x.replace('-', '').toUpperCase());

            // grab the value and replace the semi colon and extra spacing
            const value = cssVals[1].replace(';', '').trim();

            // add the CSS value to the object
            parsed = parsed + `\n${name.trim()}: '${value}',`
        }

        return `${parsed}\n`
    },

    toggle() {
        var editor = atom.workspace.getActivePaneItem();
        var selection = String(editor.getSelectedText());

        editor.insertText(this.css(selection))

        return true;
    }

};
