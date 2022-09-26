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
		/* 
		if ( s is word ){
			// 普通の文字はカット
			ed.cut( s )
		}else{
			// 空白
			if ( s is 改行 ){
				// 改行を一つだけ削除
				if ( 次の文字が空白 ){
					// 空白が続く限り行末まで削除
				}else{
					// 普通の文字ならおわり
				}
			}else{
				// 空白が続く限り行末まで削除
				
			}
		}
		*/
		// 範囲選択、各選択箇所をカット
		// 選択範囲は逆順に削除するべきでは
		editor.selections.forEach( selection => {

			if ( selection.isEmpty ) {
				// ed.delete( selection )
				const pos = new vscode.Range( selection.start, new vscode.Position( selection.start.line, selection.start.character + 1 ) )
				const char = editor.document.getText( pos );
				if ( char == " " || char == "\t" ) {
					// ed.delete( 正規表現で空白の連続を行末まで );
					const spaceRange = editor.document.getWordRangeAtPosition( selection.start, seqSpaceReg )
					if ( spaceRange ){
						ed.delete( spaceRange )
					}
				} else if ( char == "\n" ) {
					ed.delete( selection )
				} else {
					ed.delete( selection )
				}

			} else {
				// 範囲があればカット
				// 	todo: 追記じゃなくて書き換えられている気がする
				vscode.env.clipboard.writeText( editor.document.getText( selection ) );
				ed.delete( selection )
			}
		}
		)
	} );



}


/*
editor.selections.forEach( select => {
	const target_range = select.isEmpty ?
		( () => {
			const line = editor.document.lineAt( select.start.line )
			return new vscode.Range( line.range.start, line.range.end )
		} )()
		: new vscode.Range( select.start, select.end )
	const text = editor.document.getText( target_range )
	ed.replace( target_range, convert( text ) )
} )
} )
	
	
 }
*/















