---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 5 Net と .NET / 2. ブートストラップ
current: ch05-02
prev: 01-framed-by-net
prev-title: 1. .NET の枠組み
next: 03-launch-the-internet
next-title: 3. インターネットを起動する
origin: /net-and-net/bootstrapping/
---
#  Lesson 5 Net と .NET

## 2. ブートストラップ

.NET フレームワークのような外部パッケージを検出する方法は既に見たとおりですが、
ユーザーは、彼らのマシンに前提条件や依存するパッケージがまだ存在していない場合に、
単に警告を受けるだけでは満足しません。
ユーザーのマシンの状況について警告するだけでなく、
必要とされる依存パッケージを自分自身でインストールするようなインストーラを作成することは、
少しも簡単なことではありませんでした。
しかし、今では、WiX に内蔵されている Burn のおかげて、それがとても楽な仕事になりました。

バンドルと呼ばれる Burn のプロジェクトを作成することはとても簡単です。
バンドルは独立した WiX プロジェクトであることに注意してください。
MSI は以前と全く同じようにして作成します。
バンドルは、既に完成している MSI をその他の同時にインストールしたいパッケージと組み合わせて、
独立したブートストラッパ・インストーラを作成します。
このブートストラッパ・インストーラには、ユーザーが開始できる実行ファイルが含まれますが、
それに加えて、さまざまなパッケージに必要とされる独立した MSI や EXE が (外部参照として、または、
メインの実行ファイルにバンドルされて) 含まれます。

    <Wix xmlns="http://schemas.microsoft.com/wix/2006/wi">
      <Bundle Name="..." Version="..." Manufacturer="..." UpgradeCode="..." 
          Copyright="..." IconSourceFile="..." AboutUrl="...">
        <BootstrapperApplicationRef
            Id="WixStandardBootstrapperApplication.RtfLicense" />
        
        <Chain>
          <ExePackage Id="Dependency1"
              SourceFile="Dependency_package_1.exe" />
          <ExePackage Id="Dependency2"
              SourceFile="Dependency_package_2.exe" />
        
          <RollbackBoundary />
        
          <MsiPackage Id="MainPackage"
              SourceFile="Main_package.msi" Vital="yes" />
        </Chain>
      </Bundle>
    </Wix>

このプロジェクトをビルドすることは、今までに見てきた他のプロジェクトのすべてと同じように、とても簡単です。
違いと言えば、`.msi` ではなく `.exe` (正確に言えば `SampleBurn.exe`) を作成することだけです。

    candle.exe SampleBurn.wxs
    light.exe -ext WixBalExtension SampleBurn.wixobj

通常のプロジェクトとは違って、このプロジェクトはルートに **Product** ではなく **Bundle** を持ちます。
この **Bundle** が、名前、バージョン、著作権、その他よくある UI の詳細を記述するのに、ほとんど同じような属性を使用します。
Bundle は、主たる部分として、インストールされるべき全てのパッケージを順を追ってリストする **Chain** という子を持ちます。
**RollbackBoundary** タグを使って、ユーザーがインストールをロールバックすると決めたときに、
何をロールバックし、何をロールバックすべきでないかを示す境界線を引くことが出来ます。

**Chanin** は、通常、二種類の子を持ちます。すなわち、**ExePackage** と **MsiPackage** の要素です。
これらは、ともに、**SourceFile** か **DownloadUrl** か、どちらかの属性を持つことが出来ます。
第一の場合は、セットアップ・パッケージそのものが私たちのインストーラと一緒にバンドルされて、直接に配布されることになります
(とは言っても、もちろん、提供されるインストーラをウェブ・インストーラ、すなわち、
配備すべき大量の素材をインターネットからダウンロードする小さな実行ファイルとすることは、いつでも可能です)。
第二の場合は、指定された URL からインストーラが取得され、そして、実行されます。

上記の単純な例では、依存パッケージは両方とも無条件にインストールされます。
現実のシナリオにおいては、通常は、最初にこれらのパッケージが既にインストールされているかどうかをチェックして、
ターゲットマシンにそれが見つかった場合はインストールをスキップしなければなりません。
そのためには、既におなじみになっている条件を使用します。

    <Wix xmlns="http://schemas.microsoft.com/wix/2006/wi"
         xmlns:bal="http://schemas.microsoft.com/wix/BalExtension"
         xmlns:util="http://schemas.microsoft.com/wix/UtilExtension">
      <Bundle Name="..." Version="..." Manufacturer="..." UpgradeCode="..."
          Copyright="..." IconSourceFile="..." AboutUrl="...">
        <BootstrapperApplicationRef
            Id="WixStandardBootstrapperApplication.RtfLicense" />
        
        <util:RegistrySearch Root="HKLM"
            Key="SOFTWARE\Microsoft\Net Framework Setup\NDP\v4\Full"
            Value="Version" Variable="Net4FullVersion" />
        <util:RegistrySearch Root="HKLM"
            Key="SOFTWARE\Microsoft\Net Framework Setup\NDP\v4\Full"
            Value="Version" Variable="Net4x64FullVersion" Win64="yes" />
        
        <Chain>
          <ExePackage Id="Net45"
              Name="Microsoft .NET Framework 4.5.1 Setup"
              Cache="no" Compressed="yes" PerMachine="yes"
              Permanent="yes" Vital="yes" InstallCommand="/q"
              SourceFile="NDP451-KB2859818-Web.exe"
              DetectCondition="
                  (Net4FullVersion = &quot;4.5.50938&quot;)
                  AND 
                  (
                      NOT VersionNT64
                      OR
                      (Net4x64FullVersion = &quot;4.5.50938&quot;)
                  )"
              InstallCondition="
                  (VersionNT >= v6.0 OR VersionNT64 >= v6.0)
                  AND
                  (
                      NOT (
                          Net4FullVersion = &quot;4.5.50938&quot; 
                          OR
                          Net4x64FullVersion = &quot;4.5.50938&quot;
                      )
                  )"
          />
        
          <ExePackage Id="Net4Full"
              Name="Microsoft .NET Framework 4.0 Setup"
              Cache="no" Compressed="yes" PerMachine="yes"
              Permanent="yes" Vital="yes" InstallCommand="/q"
              SourceFile="dotNetFx40_Full_setup.exe"
              DetectCondition="
                  Net4FullVersion
                  AND
                  (
                      NOT VersionNT64
                      OR
                      Net4x64FullVersion
                  )"
              InstallCondition="
                  (VersionNT &lt; v6.0 OR VersionNT64 &lt; v6.0)
                  AND
                  (
                      NOT (
                          Net4FullVersion 
                          OR 
                          Net4x64FullVersion
                      )
                  )"
          />
        
          <RollbackBoundary />
        
          <MsiPackage Id="MainPackage" SourceFile="Main_package.msi"
              DisplayInternalUI="yes" Compressed="yes" Vital="yes" />
        </Chain>
      </Bundle>
    </Wix>

これは既に単なる例以上のものです。これは .NET フレームワークの扱い方を知っているインストーラの実物のコピーです。
これをコンパイルする時も、いくつかの拡張ライブラリを参照する必要があります。

    candle.exe -ext WixNetFxExtension -ext WixBalExtension 
        -ext WixUtilExtension SampleBurn.wxs
    light.exe -ext WixNetFxExtension -ext WixBalExtension
        -ext WixUtilExtension SampleBurn.wixobj

これがどのように動くか、そして、何をするかを見てみましょう。

二つの **RegistrySearch** アイテムは、ユーティリティ拡張ライブラリによるもので、
インストールされているフレームワークの現在のバージョンを決定することを助けてくれます。
**ExePackage** は、ともに、提供されているインストーラを使ってフレームワークをインストールすべき場合を決定するための条件を持っています。
最初のものは、Vista 以降のシステムに対して、まだインストールされていなければ、4.5.1 をインストールします。
第二のものは、XP のシステムに対して、まだインストールされていなければ、4.0 をインストールします。
そして、最後に、Chain は私たち自身の `.msi` をインストールします。
ここでは、同時に、私たちの `.msi` が、オリジナルの完全 UI で走るべきことをも指定しています。
このように指定しない場合は、私たちのパッケージはサイレント・モードでインストールされることになります。

二つの `.exe` インストーラと私たちの `.msi` の全てが、結果として作成される単一の SampleBurn.exe 実行ファイルにまとめられることになります。

なお、セットアップ・プログラムの外観は、次のようにしてカスタマイズすることが出来ます。

    <BootstrapperApplicationRef
        Id="WixStandardBootstrapperApplication.RtfLicense">
      <bal:WixStandardBootstrapperApplication LicenseFile="License.rtf"
          LogoFile="Logo.png" />
    </BootstrapperApplicationRef>