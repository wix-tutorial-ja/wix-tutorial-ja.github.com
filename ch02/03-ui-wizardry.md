---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 2 ユーザー・インタフェイス / 3. UI の魔法
chapter: ch02
current: ch02-03
prev: 02-custom-settings
prev-title: 2. カスタムの設定
next: 04-do-you-speak-english
next-title: 4. 英語はわかりますか
origin: /user-interface/ui-wizardry/
---
# Lesson 2 ユーザー・インタフェイス

## 3. UI の魔法

ここからが本当のマジックです。
WixUI は、どの程度まで高機能なユーザー・インタフェイスを求めるかに応じて、五つの異なるウィザードを提供してくれます。

- *WixUI_Mondo* は、「ようこそ」のページ、使用許諾契約、セットアップ・タイプ(標準、カスタム、完全)、機能のカスタマイズ、
  インストール先ディレクトリの参照とディスク容量の計算など、完全なインタフェイスを提供します。
  メンテナンス・モード用のダイアログも含まれています。
  製品の機能の中に既定ではインストールすべきでないものがある場合
  (言い換えると、標準インストールと完全インストールの間に、重要で意味のある違いがある場合)は、このタイプを使用すべきです。
- *WixUI_FeatureTree* は、フル・セットと同じですが、ユーザーはセットアップ・タイプを選択することが出来ません。
  セットアップ・タイプは常にカスタムであるという前提に立って、ユーザーが使用許諾契約に同意した後は、
  直接に、機能のカスタマイズのダイアログに進みます。
- *WixUI_InstallDir* は、ユーザーがインストール先ディレクトリを選ぶことが出来ますが、
  通例の機能をカスタマイズするページは提供されません。ディレクトリの選択が完了すると、自動的にインストールが始まります。(\*)
- *WixUI_Minimal* は、非常に簡単なユーザー・インタフェイスを特徴としていて、
  「ようこそ」のページと使用許諾契約のページを一緒にした単一のダイアログがあるだけです。
  このダイアログの後は、ユーザーに何もカスタマイズを許さず、インストールが自動的に進行します。
  アプリケーションがインストールすべきオプション機能を何も持っていない場合に使って下さい。
- *WixUI_Advanced* は、単純なワン・クリックのインストールを提供するという点では、WixUI_Minimal にかなり良く似ていますが、
  ユーザーがそうしたいと望めば、機能やフォルダを選ぶことも出来ます。

フル・セットのユーザー・インタフェイスを使用するために必要な事は、ソースに二行を追加して、
WixUI インタフェイス・ライブラリをプロジェクトに含めることだけです。

{% highlight xml %}
    <UIRef Id="WixUI_Mondo" />
    <UIRef Id="WixUI_ErrorProgressText" />
{% endhighlight %}

最初の参照によって適切なユーザー・インタフェイス・ライブラリが読み込まれます。
しかし、このライブラリは、言語ファイルにあるローカライズされたエラーとアクションのテキスト(英語の場合は、修正されたテキスト)
を自動的に使う訳ではありません。
二番目の参照を追加しない場合、インストーラ・パッケージはわずかに小さくなって、
Windows Installer の内部にある組み込みのメッセージを使うようになります。

(\*) WixUI_InstallDir のダイアログ・セットを使う場合は、ソースのどこかで、下記のように、追加のプロパティを提供しなければなりません。

{% highlight xml %}
<Property Id="WIXUI_INSTALLDIR" Value="TOP_LEVEL_DIR" />
{% endhighlight %}

そして、最後に、これまでのサンプルと全く同じように、ソースの記述を終了します。

{% highlight xml %}
    <Icon Id="Hoge10.exe" SourceFile="HogeAppl10.exe" />
  </Product>
</Wix>
{% endhighlight %}

ユーザー・インタフェイスの変種のすべては、共通のコンパイル済みライブラリに入っています。
私たちは、既に述べたようにコマンド・ライン・スイッチを使って、この拡張ライブラリに対してリンクするだけで良いのです。
統合開発環境の中で作業をしている場合は、同じ効果を得るために、このライブラリに対する参照を追加する必要があります。

{% highlight bat %}
candle.exe SampleWixUI.wxs
light.exe -ext WixUIExtension SampleWixUI.wixobj
{% endhighlight %}

ユーザー・インタフェイスの外観のいくつかは、代替のファイルを指定するだけでカスタマイズすることが出来ます。
既定のファイルはツールセットの中にありますが、代替のビットマップ、アイコン、ライセンス文書を自分で作ることが可能です。
全部でなく、特定のファイルだけを置き換えることも出来ます。
ファイルのパスは変数に保持されていますので、コマンド・ラインで指定することも、直接ソースに書くことも出来ます。

{% highlight xml %}
  <WixVariable Id="WixUILicenseRtf" Value="path\License.rtf" />
  <WixVariable Id="WixUIBannerBmp" Value="path\banner.bmp" />
  <WixVariable Id="WixUIDialogBmp" Value="path\dialog.bmp" />
  <WixVariable Id="WixUIExclamationIco" Value="path\exclamation.ico" />
  <WixVariable Id="WixUIInfoIco" Value="path\information.ico" />
  <WixVariable Id="WixUINewIco" Value="path\new.ico" />
  <WixVariable Id="WixUIUpIco" Value="path\up.ico" />
{% endhighlight %}

これらの意味と詳細は以下の通りです。

- *WixUIBannerBmp* : 493 × 58 ピクセル。このビットマップは、最初のページを除く全てのページの上部に表示されます。
- *WixUIDialogBmp* : 493 × 312 ピクセル。このビットマップは、インストーラの最初のページに表示されます。
- *WixUIExclamationIco* : 32 × 32 ピクセル。感嘆符アイコン。
- *WixUIInfoIco* : 32 × 32 ピクセル。情報サイン・アイコン。
- *WixUINewIco* : 16 × 16 ピクセル。「新しいフォルダ」アイコン。
- *WixUIUpIco* : 16 × 16 ピクセル。「一つ上のフォルダ」アイコン。
- *WixUILicenseRtf* : なるべくなら、ワードパッドのような単純なエディタを使って作成して下さい。
  どうしてもワードのような必要以上に複雑なアプリケーションを使いたい場合は、
  せめて最終版はワードパッドで保存し直すことを検討して下さい。その方が、RTF ファイルがシンプルで小さくなります。

> 訳註：これらのビットマップのサイズは、絶対にそうでなければならない、というものではありません。
> [8.7 法律用語](/ch08/07-legalese.html) の末尾にあるビットマップについての記述および訳註を参照してください。
