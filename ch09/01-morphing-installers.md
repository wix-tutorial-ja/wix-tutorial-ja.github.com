---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 9 トランスフォーム / 1. インストーラを変形する
current: ch09-01
prev: index
prev-title: Lesson 9 トランスフォーム
next: /ch10/index
next-title: Lesson 10 標準ライブラリ
origin: /transforms/morphing-installers/
---
# Lesson 9 トランスフォーム

## 1. インストーラを変形する

トランスフォームを使う理由として、一つ面白いものがあります。
それは、ユーザー・インタフェイスの文字列を別の言語に変更する、というものです。
既に論じたように、WiX は WixUI のインタフェイス言語を地域化 (ローカライズ) することを許しています。
その機能を使えば、さまざまな言語でインストーラを作成することが出来ます。
しかし、複数の言語を必要とする場合は、この簡単な解法では、複数の平行するインストーラが作成できるだけです。
それぞれのインストーラがそれぞれ固有の言語を表示するのは結構なことですが、
配置すべき全てのファイルを別々のパッケージに重複して保存しなければなりません。

こういう場合にトランスフォームが役立ちます。
まず、基本となるインストーラ (これは英語でも何でも構いません) から始めます。
追加するすべての言語は実際には実行時のパッチになります。
Windows Installer が最初のページを表示する前にそのパッチを呼び出して、UI の文字列を指定された言語に翻訳するのです。
こうして、全ての言語は同一のインストーラ・パッケージを共有します。
インストールされるべきファイルはパッケージの中に一度しか出現せず、
それぞれの追加される言語はパッケージのサイズを少し増加させるだけになります。

インストールは小さなブートストラッパーで起動します。
ブートストラッパーは表示可能な言語をリストアップして、おそらくは実行中のオペレーティング・システムの言語を既定値として選ぶでしょうが、
ユーザーが好きな言語を選ぶことも出来ます。
言語の選択が終ると、ブートストラッパーは適用すべきトランスフォームを指定して実際のインストーラを起動します。

そのような複数言語インストーラを作成するために必要となる変更は驚くほど小さいものです。

> 訳註：このレッスンについては、日本語版のサンプルは提供していません。
> ここで説明されている事柄に関しては、WiX のソース自体には、注目すべきところはほとんど有りません。

{% highlight xml %}
<?xml version='1.0' encoding='windows-1252'?>
<Wix xmlns='http://schemas.microsoft.com/wix/2006/wi'>

  <Product Name='Hoge 1.0'
      Id='YOURGUID-86C7-4D14-AEC0-86416A69ABDE'
      UpgradeCode='YOURGUID-7349-453F-94F6-BCB5110BA4FD'
      Language='1033' Codepage='$(var.codepage)'
      Version='1.0.0' Manufacturer='Piyo Software'>

    <Package Id='*' Keywords='Installer'
        Description="Piyo Software's Hoge 1.0 Installer"
        Comments='Hoge is a registered trademark of Piyo Software.'
        Manufacturer='Piyo Software' InstallerVersion='100'
        Languages='1033' Compressed='yes' 
        SummaryCodepage='$(var.codepage)' />

  ...

</Wix>
{% endhighlight %}

最初のステップとして、地域化されたインストーラを別々にビルドします。
以前とほとんど同じですが、それぞれのインストーラにサポートされている言語のテーブルで示されている正しいコードページを指定しなければなりません。

{% highlight bat %}
candle.exe SampleMulti.wxs -dcodepage=1252
light.exe -ext WixUIExtension -cultures:en-us -out SampleMulti.msi 
    SampleMulti.wixobj

candle.exe SampleMulti.wxs -dcodepage=1250
light.exe -ext WixUIExtension -cultures:hu-hu -out Sample_Hu-hu.msi 
    SampleMulti.wixobj

candle.exe SampleMulti.wxs -dcodepage=1252
light.exe -ext WixUIExtension -cultures:fr-fr -out Sample_Fr-fr.msi
    SampleMulti.wixobj
{% endhighlight %}

次に、WiX のトランスフォーム・ツール *Torch* を使って、順番に、地域化されたインストーラとベースになるインストーラ (SampleMulti.msi)
を比較して、両者間の差異を含んだ .mst トランスフォーム・ファイルを作成します。

{% highlight bat %}
torch.exe -p -t language SampleMulti.msi Sample_Hu-hu.msi
    -out hu-hu.mst
torch.exe -p -t language SampleMulti.msi Sample_Fr-fr.msi
    -out fr-fr.mst
{% endhighlight %}

これで、ブートストラップ・インストーラが、適切な言語パッケージを指定してベースのインストーラ・パッケージを呼び出すことが出来るようになります。

{% highlight bat %}
msiexec /i SampleMulti.msi TRANSFORMS="fr-fr.mst"
{% endhighlight %}

この場合、ブートストラッパーが必要になる他に、独立したトランスフォーム・ファイルも配布する必要が生じます。
より良い方法は、トランスフォームを元のパッケージに埋め込むことです
(今のところ WiX ではサポートされていませんが、[EmbedTransform](https://www.firegiant.com/system/files/samples/EmbedTransform.zip)
というツールをダウンロードして使うことが出来ます)。

{% highlight bat %}
EmbedTransform.exe SampleMulti.msi hu-hu.mst
EmbedTransform.exe SampleMulti.msi fr-fr.mst
{% endhighlight %}

使い方で違うところは一点だけ、トランスフォーム・ファイルの名前の前にコロンを付けて、
Windows Installer にパッケージ内部を探すように指示することだけです。

{% highlight bat %}
msiexec /i SampleMulti.msi TRANSFORMS=":fr-fr.mst"
{% endhighlight %}
