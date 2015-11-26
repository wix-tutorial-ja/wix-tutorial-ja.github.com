---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 4 アップグレードとモジュラー化 / 4. 断片
current: ch04-04
prev: 03-patchwork
prev-title: 3. パッチワーク
next: 05-mergers
next-title: 5. 融合するもの
origin: /upgrades-and-modularization/fragments/
---
# Lesson 4 アップグレードとモジュラー化

## 4. 断片

フラグメント(Fragment)は、大きなインストール・プロジェクトを分割する方法を提供してくれます。
基本的には、フラグメントは WiX ソースのひとかたまりを包み込むラッパーです。
中身は、好みに応じて、どんなに簡単でも、どんなに複雑でも構いません。
プログラム開発で使用するオブジェクト・ファイルやライブラリと同じように、
フラグメントは他の製品のインストーラ・パッケージにリンクして組み込むことが出来ます。
もし WiX の二つのツール、Candle と Light をコンパイラとリンカであると考えるなら、フラグメントは、
ちょうどソース・コード・モジュールのように、それぞれ独立してオブジェクト・コード (`.wixobj` ファイル) にコンパイル出来るものです。
大規模なインストーラ・パッケージのリビルドは、おなじみの makefile の手法を使うことで、劇的に加速することが出来ます。
makefile の手法では、最後のコンパイルの後で変化があった `.wxs` ソース・ファイルだけを再コンパイルし、
`.wixobj` ファイルを、新しいものも、古いものも、まとめてリンクして、最終的なパッケージを作成します。

チュートリアルの中ではそんなに大規模で複雑なプロジェクトをサンプルにすることは出来ませんので、
[SampleFragment](https://www.firegiant.com/system/files/samples/SampleFragment.zip) は多少わざとらしいものにならざるを得ません。
最初のインストーラを再利用しますが、論点を説明するために、いくつかの部分を切り出して、独立したフラグメントに外部委託します。
ユーザー・マニュアルのファイルをインストールするコンポーネントはメインのソースから削除しました。
従って、下記の参照は指し示すものが無いものになります。

> 訳註：SampleFragment の日本語版は [Sample-4-4-Fragment.zip](/samples/Sample-4-4-Fragment.zip) です。

{% highlight xml %}
  <Feature Id='Complete' Title='ほげ 1.0' Description='完全パッケージ。'
      ... >

    <Feature Id='Documentation' Title='説明書'
        Description='取扱説明書。' Level='1'>
      <ComponentRef Id='Manual' />
    </Feature>
  </Feature>
{% endhighlight %}

削除したコンポーネントは、それ自身のファイルに入れて、**Fragment** タグで囲みます。
ここでは、メインのソース・ファイルで既に宣言している **Directory** に対しては、*参照するだけ* にします。
なぜなら、同じものを二つの箇所で宣言することは出来ないからです。
フラグメントの中に代理を置くことが出来るものは、すべて変異形のタグを持っています。
別の場所で定義された機能を参照するためには **FeatureRef** を使い、プロパティを参照するためには **PropertyRef** を使います。

{% highlight xml %}
<?xml version='1.0' encoding='utf-8'?>
<Wix xmlns='http://schemas.microsoft.com/wix/2006/wi'>
  <Fragment Id='FragmentManual'>
    <DirectoryRef Id='INSTALLDIR'>
      <Component Id='Manual'
          Guid='YOURGUID-574D-4A9A-A266-5B5EC2C022A4'>
        <File Id='Manual' Name='Manual.pdf' DiskId='1'
            Source='Manual.pdf' KeyPath='yes'>
          <Shortcut Id="startmenuManual" Directory="ProgramMenuDir"
              Name="取扱説明書" Advertise="yes" />
        </File>
      </Component>
    </DirectoryRef>

  </Fragment>
</Wix>
{% endhighlight %}

私たちは既にこの二つのファイルをコンパイルし、リンクして、一つのインストーラ・パッケージにすることが出来ます。
この二つのコンパイルの単位を一緒にリンクするためには、ソースには一行も加える必要が無い、ということに注意して下さい。
一つのファイルからもう一つのファイルで定義されているコンポーネントを参照している、という事実さえあれば、期待する通りのリンクが生じます。
フラグメントの中にある一つの要素を参照すると、フラグメント全体が開かれて、フラグメント内の全ての要素が直ちにアクセス可能になります。
この動作は、いつものプログラミング言語で慣れているものとは異なっています。
フラグメントをリンクすると、別の場所で定義されている要素を使うことが出来るようになるだけでなく、
参照されているフラグメントの要素を一つでも使うと、常に、全部の要素が有効になるのです。

サンプルをビルドするためには、下記のコマンドを使います。

{% highlight bat %}
candle.exe SampleFragment.wxs Manual.wxs
light.exe -out SampleFragment.msi SampleFragment.wixobj Manual.wixobj
{% endhighlight %}

フラグメントの用途は多岐にわたっていて、単一のセットアップ・プロジェクトの中で使えるだけでなく、
異ったプロジェクト間で共通の項目を共有するために使うことも出来ます。
例えば、関連する複数のアプリケーションがあって、一つないし複数の共通ファイルを共有している場合
(例えば、デバイス・ドライバーや、その他の DLL で提供する機能などを共有している場合)、
一つのアプリケーションを削除しても、他のアプリケーションがまだ必要としている共通ファイルは決して削除しないようにする必要があるでしょう。

こういう場合、共通ファイルをそれ自身の独立したフラグメントに入れて、
別々のアプリケーションの全てのセットアップから、そのフラグメントを参照して下さい。
コンポーネントが同一である (従って、コンポーネント GUID が同一である) ため、
Windows Installer は、この共通ファイルを必要とする全てのアプリケーションを記録しておくことが出来ます。
さらに、新しいバージョンが決して古いもので上書きされないように、バージョン管理のルールを共通ファイルに対して適切に適用することが出来ます。