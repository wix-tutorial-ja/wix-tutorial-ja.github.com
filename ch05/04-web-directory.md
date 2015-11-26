---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 5 Net と .NET / 4. ウェブ・ディレクトリ
current: ch05-04
prev: 03-launch-the-internet
prev-title: 3. インターネットを起動する
next: 05-services-rendered
next-title: 5. サービスの提供
origin: /net-and-net/web-directory/
---
#  Lesson 5 Net と .NET

## 4. ウェブ・ディレクトリ

WiX ツールセットの追加のライブラリの中には、
IIS のウェブ・ディレクトリを作成するような付加的な仕事をインストーラが実行出来るようにするものもあります。
このような拡張機能は、適切な WiX ライブラリをリンクするだけで使用出来ます。
リンカが、必要なヘルパー DLL を自動的にインストーラ・パッケージに含めてくれます。

最初に、ウェブ・サイトと、それに所属するファイルを作らなければなりません。

{% highlight xml %}
<Directory Id='TARGETDIR' Name='SourceDir'>
  <Directory Id='ProgramFilesFolder' Name='PFiles'>
    <Directory Id='InstallDir' Name='Piyo'>
      <Component Id='default.phpComponent'
          Guid='YOURGUID-5314-4689-83CA-9DB5C04D5742'>
        <File Id='default.htmFile' Name='default.htm'
            Source='default.htm' DiskId='1' KeyPath='yes' />
      </Component>
    </Directory>
  </Directory>
{% endhighlight %}

次のステップは、仮想ディレクトリの作成です。

{% highlight xml %}
  <Component Id='TestWebVirtualDirComponent'
      Guid='YOURGUID-6304-410E-A808-E3585379EADB'>
    <WebVirtualDir Id='TestWebVirtualDir'
        Alias='Test' Directory='InstallDir'
        WebSite='DefaultWebSite'>
      <WebApplication Id='TestWebApplication' Name='Test' />
    </WebVirtualDir>
  </Component>

</Directory>
{% endhighlight %}

最後に、ウェブ・サイトを参照するエントリを作成します。

{% highlight xml %}
<WebSite Id='DefaultWebSite' Description='Default Web Site'>
  <WebAddress Id='AllUnassigned' Port='80' />
</WebSite>
{% endhighlight %}

インストーラ・パッケージをリンクするときは、適切な WiX ライブラリとリンクしなければなりません。
リンカに複数の WiX オブジェクト・ファイルを渡しますので、出力ファイルの名前も指定しなければなりません。

{% highlight bat %}
light.exe -out SampleWebDir.msi SampleWebDir.wixobj path\sca.wixlib
{% endhighlight %}

完全な [SampleWebDir](https://www.firegiant.com/system/files/samples/SampleWebDir.zip) をダウンロードすることが出来ます。

> 訳註：上記は WiX 2 の IIS 拡張に基づくものであり、WiX 3 には適用出来ない所があります。
> また、提供されている SampleWebDir も、そのままでは、WiX 3 でビルド出来ません。
>
> (1) WiX 3 では IIS 拡張が独立の名前空間に移動されたために、Wix 要素で IIS 拡張のスキーマを参照する必要があります。
> 
>     <Wix xmlns='http://schemas.microsoft.com/wix/2006/wi'
>          xmlns:iis='http://schemas.microsoft.com/wix/IIsExtension'>
>
> 同様に、IIS 拡張に属する要素には IIS 拡張の名前空間の修飾が必要です
> (`iis:WebVirtualDir`, `iis:WebApplication`, `iis:WebSite` および `iis:WebAddress`)。
>
> (2) WiX 3 では IIS 拡張は sca.wixlib ではなく WixIISExtension.dll で提供されています。
> コンパイラおよびリンカのコマンド・ラインにおいて、"-ext WixIISExtension" を指定する必要があります。
> 
> WiX 3 に対応した日本語版 [Sample-5-4-WebDir.zip](/samples/Sample-5-4-WebDir.zip) を参照して下さい。
> 
> なお、WixIISExtension の日本語地域化ファイルは(まだ)提供されていませんので、
> "-cultures:ja-jp" を指定する場合は、日本語地域化ファイルを自分で書く必要があります。