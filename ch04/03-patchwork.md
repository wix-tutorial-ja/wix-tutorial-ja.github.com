---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 4 アップグレードとモジュラー化 / 3. パッチワーク
current: ch04-03
prev: 02-replacing-ourselves
prev-title: 2. 自分自身を置き換える
next: 04-fragments
next-title: 4. 断片
origin: /upgrades-and-modularization/patchwork/
---
# Lesson 4 アップグレードとモジュラー化

## 3. パッチワーク

更新しなければならない小さなファイルが一つか二つ混じっているというだけの理由で、
何メガバイトものファイルを入れたアップグレード・インストーラ・パッケージを作ることは、あまり効率的だとは言えないでしょう。
従来から、そういう場合には、いつでも、パッチの方が良い解決策でした。
パッチは、基本的には旧バージョンと新バージョンの異なる部分を入れたもので、
ユーザーのコンピュータにある古いファイルを魔法のごとく自動的に新しいものに変えることが出来るものです。
パッチ・パッケージには新規に配置するファイルを入れることも出来ます。

WiX ツールセットもパッチ・インストーラ・パッケージ (`.msp` ファイル) を作成することが出来ます。
パッチ・インストーラ・パッケージは、二つの通常のインストーラ・パッケージ
(一つは、バグのある古いファイルを持つ元のパッケージ、もう一つは、修正されたファイルを持つ新しいパッケージ) から作成されます。
ダウンロードできる [SamplePatch](https://www.firegiant.com/system/files/samples/SamplePatch.zip) の中には、
ユーザー・インタフェイスを持たない非常に簡単な二つのインストーラ・パッケージが入っています。
両方ともファイルを一つだけインストールしますが、そのファイルが元のバージョンとパッチを当てられたバージョンで変ります。
ソース・ファイルの詳細は、もう今では、完全に見慣れたものになっている筈です。
`Error.wxs` と `Fixed.wxs` のソース・ファイルの唯一の違いは、**Source** のファイルの参照だけです。

> 訳註：SamplePatch の日本語版は [Sample-4-3-Patch.zip](/samples/Sample-4-3-Patch.zip) です。

{% highlight xml %}
  <File Id='HogeEXE' Name='HogeAppl10.exe' DiskId='1'
      Source='Error\HogeAppl10.exe' KeyPath='yes' />
{% endhighlight %}

対するに、

{% highlight xml %}
  <File Id='HogeEXE' Name='HogeAppl10.exe' DiskId='1'
      Source='Fixed\HogeAppl10.exe' KeyPath='yes' />
{% endhighlight %}

パッチは第三のソース・ファイルから作成されます。
これは、前と全く同じように、XML ファイルですが、その内容は今まで書いたファイルとは異なるものです。

{% highlight xml %}
<?xml version='1.0' encoding='utf-8'?>
<Wix xmlns='http://schemas.microsoft.com/wix/2006/wi'>
  <Patch AllowRemoval='yes' Manufacturer='ぴよソフト'
      MoreInfoURL='www.piyosoft.co.jp' DisplayName='ほげ 1.0.0 パッチ'
      Description='小さな更新パッチ' Classification='Update'
      Codepage='932'>

    <Media Id='5000' Cabinet='Sample.cab'>
      <PatchBaseline Id='Sample' />
    </Media>

    <PatchFamily Id='SamplePatchFamily' Version='1.0.0.0'
        Supersede='yes'>
      <ComponentRef Id='MainExecutable' />
    </PatchFamily>

  </Patch>
</Wix>
{% endhighlight %}

**Classification** 属性は、*Hotfix*, *Security Rollup*, *Critical Update*, *Update*, *Service Pack* または *Update Rollup* のどれかです。
**AllowRemoval** は、ユーザーが後でパッチをアンインストールすることが出来るかどうかを決定します。
**PatchFamily** タグが、パッチを適用される項目を包み込んでいます。
そして、**Supersede** は、このパッチが同じファミリーに属する以前のすべてのパッチに取って代るものであるか否かを決定します。

ビルド作業は以前のプロジェクトよりも少し複雑になります。
最初に、ベースになる二つのパッケージを通常の方法でビルドします。二つとも、それ自身のフォルダに入れます。

{% highlight bat %}
candle.exe Error.wxs
light.exe -out Error\Product.msi Error.wixobj

candle.exe Fixed.wxs
light.exe -out Fixed\Product.msi Fixed.wixobj
{% endhighlight %}

次に、別の WiX ツール、**torch** を使って、二つのインストーラ・パッケージの間のトランスフォームを作成します。
コマンド・ラインの引数で、プログラムに対して、Windows Installer の形式 (`.msi` と `.mst`) ではなく、
WiX 自身の形式である `.wixpdb` と `.wixmst` を使うように指示を与えます。

{% highlight bat %}
torch.exe -p -xi Error\Product.wixpdb Fixed\Product.wixpdb
          -out Patch.wixmst
{% endhighlight %}

さらに、いつもの WiX のコンパイラとリンカを使ってパッチ・パッケージをビルドしなければなりませんが、
今回は、出力形式が通常のものとは違う `.wixmsp` になります。
リンカに対してこのファイル形式で出力するように指示する必要はありません。
リンカ自身がソース・ファイルの内容に従って出力形式を自動的に決定します。

{% highlight bat %}
candle.exe Patch.wxs
light.exe Patch.wixobj
{% endhighlight %}

そして、最後に、前のステップの出力結果と、少し前に作ったトランスフォームから、
実際の Windows Installer のパッチ・パッケージをビルドします。
パッチ作成を担当する WiX ツールである **pyro** に対しては、トランスフォーム・ファイルの名前だけでなく、
対応する **PatchBaseline/@Id** 属性も、コマンド・ラインで指定してやる必要があります。

{% highlight bat %}
pyro.exe Patch.wixmsp -out Patch.msp -t Sample Patch.wixmst
{% endhighlight %}

Patch.msp が実際に配布されるパッチ・インストーラになります。
これをテストするためには、最初にオリジナルのパッケージ(Error/Product.msi)をインストールし、次にパッチを当てます。

{% highlight bat %}
msiexec /p Patch.msp
{% endhighlight %}

... そしてファイルが本当に新しいバージョンに変っていることを確認して下さい。
次に、**プログラムの追加と削除** を開いて、**更新プログラムの表示** にチェックを入れ、
最初にパッチを削除し (変更されたファイルは元のファイルに戻ります)、次にプログラムそのものを削除してください。

> 訳注：以下、現在は削除されている記述を参考のために記します。
>
> 管理者であれば、//server/Patch.msi に置かれている管理ソース・イメージを、パッチによって新しいソース・イメージに更新することが出来ます。
> この新しいソース・イメージは、更新されたフルセットの配布メディアから管理インストールによって作成された場合と同一のソース・イメージになります。
>
>     msiexec /a //server/Patch.msi /p Patch.msp
> 
> プログラムを使用するワークグループのメンバーは、更新を受け取るために、
> 新しい管理ソース・イメージからアプリケーションを再インストールしなければなりません。
> アプリケーションを完全に再インストールして、更新された .msi ファイルをユーザーのコンピュータにキャッシュとして保存するために、
> ユーザーは以下のコマンドを実行します。
> 
>     msiexec /fvomus //server/Patch.msi