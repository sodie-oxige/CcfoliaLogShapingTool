# 袖置式ログ整形ツール

ココフォリアから出力したログを整形して表示するツールです。  

***
### 初期設定

まずchrome拡張機能設定(chrome://extensions/)から  

1. 「デベロッパーモード」をオン  
2. 「パッケージ化されていない拡張機能を読み込む」をクリック  
3. このファイルの入っているフォルダ（変更していなければ「CcfoliaLogShapingTool-main」）をクリック→「フォルダーの選択」  

これで拡張機能がインストールされました。次いで  

4. ログファイルをchromeブラウザにドラッグ＆ドロップするか、既定のプログラムをchromeに設定して開く。  

これでログが整形された状態で表示されるはず。  

***
### 詳細設定

HTML、CSSを使用することで表示をカスタマイズすることができます。  
本拡張機能のオプション画面で可能です。（一般的な拡張機能のオプションの開き方、アイコンクリックなどで開けます）  
基本的なHTMLに加え、変数として  
 - author：発言者
 - tab：タブ
 - color：色
 - text：発言内容
 - filename：ファイル名。「～.html」の～の部分。

が使用できます。  
使用する場合は{author}など、{}で変数名を囲って使用してください。  

後は雰囲気で使ってください。  
制作者には何がわからないかわからない。  
ので、ここに乗せとくべき情報があれば[@sodie_oxige](https://twitter.com/sodie_oxige)まで。

***
本ツールは「ICOON MONO」さまのアイコン素材を一部利用しています。
