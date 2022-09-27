import * as vscode from 'vscode';

export function deleteSequentialSpaces( option?: any ) {

	if ( !option ) {
		option = {}
	}
	const editor = vscode.window.activeTextEditor
	if ( !editor ) {
		vscode.window.showInformationMessage( 'No editor is active' )
		return
	}

	editor.edit( ( ed: vscode.TextEditorEdit ) => {
		// カーソル箇所が普通文字ならカット、空白文字なら連続削除
		// マルチカーソルは対応しない。executeCommand() を利用すると各コマンドがエディタ全体に効果発揮する。カーソル回数分実行されてしまうため
		//	それでもマルチカーソルになっている場合、メインのカーソルの次行の状態によって他のカーソルでも同じ挙動がされてしまう

		// メインのカーソルのみ状態を調べる
		const selection = editor.selection;

		if ( selection.isEmpty ) {
			const document = editor.document;
			// カーソルの1文字

			const pos = new vscode.Range( selection.active, selection.active.translate( 0, 1 ) );
			const char = document.getText( pos );
			if ( char == " " || char == "\t" ) {
				// 次の単語までの連続した空白を削除
				vscode.commands.executeCommand( 'deleteWordStartRight' );
			} else if ( document.lineAt( selection.active ).range.end.character == selection.active.character ) {
				// 行末

				// 次行の1文字目が空白文字かを先に取っておく
				let flagSpaceLetter = false;
				if ( selection.active.line < document.lineCount - 1 ) {
					const nextLineTopChar = document.lineAt( selection.active.line + 1 ).text.charCodeAt( 0 );
					if ( nextLineTopChar == 0x9 || nextLineTopChar == 0x20 ) {
						flagSpaceLetter = true;
					}
				}

				// 行末コードを削除
				vscode.commands.executeCommand( 'deleteRight' );
				if ( flagSpaceLetter ) {
					// 次行先頭が空白なら続けて空白削除
					vscode.commands.executeCommand( 'deleteWordStartRight' );
				}

			} else {
				// 普通の文字なら1文字削除
				vscode.commands.executeCommand( 'deleteRight' );
			}
		} else {
			// 選択範囲はクリップボードへカット
			vscode.commands.executeCommand( 'editor.action.clipboardCutAction' );
		}
	} );
}












