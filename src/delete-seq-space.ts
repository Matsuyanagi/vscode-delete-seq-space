import * as vscode from 'vscode';

const DELETE_SEQ_SPACE = 'extension.deleteSequentialSpaces'

export const commands_map = new Map<string, ( args: any ) => void>( [
	[ DELETE_SEQ_SPACE, ( args: any ) => { deleteSequentialSpaces( args ) } ]
] );


export function deleteSequentialSpaces( option?: any ) {

	vscode.window.showInformationMessage( 'export function deleteSequentialSpaces() !!' );

	if ( !option ) {
		option = {}
	}
	const editor = vscode.window.activeTextEditor
	if ( !editor ) {
		vscode.window.showInformationMessage( 'No editor is active' )
		return
	}
	const seqSpaceReg = new RegExp( "[\s]+" );

	editor.edit( ( ed: vscode.TextEditorEdit ) => {
		// カーソル箇所が普通文字ならカット、空白文字なら連続削除

		// 範囲選択、各選択箇所をカット
		// 選択範囲は逆順に削除するべきでは
		// 複数範囲指定には対応しなくていいのでは?でも複数行行頭空白削除とかやりたいか
		editor.selections.forEach( selection => {

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
						if ( nextLineTopChar == 9 || nextLineTopChar == 0x20 ) {
							flagSpaceLetter = true;
						}
					}

					vscode.commands.executeCommand( 'deleteRight' );
					if ( flagSpaceLetter ) {
						vscode.commands.executeCommand( 'deleteWordStartRight' );

					}

				} else {
					vscode.commands.executeCommand( 'deleteRight' );
				}

			} else {
				vscode.commands.executeCommand( 'editor.action.clipboardCutAction' );
			}
		}
		)
	} );



}












