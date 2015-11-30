---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 4 アップグレードとモジュラー化 / 5. 融合するもの
chapter: ch04
current: ch04-05
prev: 04-fragments
prev-title: 4. 断片
next: /ch05/index
next-title: Lesson 5 Net と .NET
origin: /upgrades-and-modularization/mergers/
---
# Lesson 4 アップグレードとモジュラー化

## 5. 融合するもの

フラグメントを使用すると、大きなパッケージを管理可能なソース・コードの固まりに分割することが出来て、
開発者の共同作業やコードの再利用が可能になります。
従って、フラグメントは、WiX ソース・コードが共有可能であり、また、実際に共有されるであろう社内開発に最も適していると言えます。
しかし、第三者に完全なインストーラ・パッケージを提供することが出来る、もっと強力なもう一つのメカニズムが存在します。
すなわち、マージ・モジュールです。
例えば、あなたの製品 A が他のベンダーの製品 B に依存しているとしましょう。
彼らの製品をインストールするために作られたマージ・モジュールを使えば、彼らの製品をあなたの製品の一部として、
同時に二つをインストールすることが出来るようになります。

マージ・モジュールを記述する方法は、今までやってきたスタンドアロンのソース・ファイルの場合と非常によく似ています。
ただし、**Product** ではなく、**Module** タグを定義します。
また、これまでのパッケージとは違って、一意の GUID は、私たち自身が定義しなければなりません。

{% highlight xml %}
<?xml version='1.0' encoding='utf-8'?>
<Wix xmlns="http://schemas.microsoft.com/wix/2006/wi">
  <Module Id="File1" Language="1041" Codepage="932" Version="1.2.3">

    <Package Id="YOURGUID-8DEE-4410-990A-1802896C4209"
        InstallerVersion="100" Languages="1041"
        Manufacturer="ぴよソフト" SummaryCodepage="932"
        AdminImage="no" />

      <Directory Id='TARGETDIR' Name='SourceDir'>
        <Directory Id='ProgramFilesFolder' Name='PFiles'>
          <Directory Id='Piyo' Name='Piyo'>
            <Directory Id='INSTALLDIR' Name='Hoge 1.0'>

              <Component Id="File1"
                  Guid="YOURGUID-CF0E-40AB-ACC5-0E9A5F112628">
                <File Id="File1.txt" Name="File1.txt"
                    Source="File1.txt" KeyPath='yes' />
              </Component>

            </Directory>
          </Directory>
        </Directory>
      </Directory>

  </Module>
</Wix>
{% endhighlight %}

サンプルでは、第二のマージ・モジュールも使います。
ソース・ファイルは前のものとほとんど同じですが、次の点で違っています。
すなわち、配置すべきファイルとして違うファイルを参照し、
この第二のモジュールが第一のモジュールに依存していることを示すために **Dependensy** タグを含めます。
この依存関係を示すために、**Module ID** 識別子に **Package** GUID を追加したものを使います — 
Package GUID は、元のハイフンをアンダースコアで置き換えたものにしなければいけません。

{% highlight xml %}
  <Module Id="File2" Language="1041" Codepage="932" Version="1.2.3">
    ...
    <File Id="File2.txt" Name="File2.txt"
        Source="File2.txt" KeyPath='yes' />
    ...
    <Dependency
        RequiredId="File1.YOURGUID_8DEE_4410_990A_1802896C4209"
        RequiredLanguage="1041" RequiredVersion="1.2.3" />
  </Module>
{% endhighlight %}

結合されたインストーラ・パッケージを作るために、通常のスタンドアロンの WiX ソース・ファイルを書きます。

{% highlight xml %}
<?xml version='1.0' encoding='utf-8'?>
<Wix xmlns="http://schemas.microsoft.com/wix/2006/wi">
  <Product Name='ほげ 1.0'
           Id='YOURGUID-86C7-4D14-AEC0-86416A69ABDE'
           UpgradeCode='YOURGUID-7349-453F-94F6-BCB5110BA4FD'
           Language='1041' Codepage='932'
           Version='1.0.0' Manufacturer='ぴよソフト'>

    <Package Id='*' Keywords='インストーラ'
             Description="ぴよソフト's ほげ 1.0 インストーラ"
             Comments='ほげはぴよソフトの登録商標です。'
             Manufacturer='ぴよソフト' InstallerVersion='100'
             Languages='1041' Compressed='yes'
             SummaryCodepage='932' />

    <Media Id="1" Cabinet="product.cab" EmbedCab="yes" />

    <Directory Id='TARGETDIR' Name='SourceDir'>
      <Directory Id='ProgramFilesFolder' Name='PFiles'>
        <Directory Id='Piyo' Name='Piyo'>
          <Directory Id='INSTALLDIR' Name='Hoge 1.0'>
{% endhighlight %}

通常のコンポーネントの代りにマージ・モジュールを参照します。**SourceFile** は `.msm` ファイルを指し示します。

{% highlight xml %}
            <Merge Id="file1" Language="1041"
                   SourceFile="Module1.msm" DiskId="1" />
            <Merge Id="file2" Language="1041"
                   SourceFile="Module2.msm" DiskId="1" />

          </Directory>
        </Directory>
      </Directory>
    </Directory>

    <Feature Id="Msm" Title="Msm" Level="1">
      <MergeRef Id="file1" />
      <MergeRef Id="file2" />
    </Feature>

  </Product>
</Wix>
{% endhighlight %}

完全な [SampleMergeModule](https://www.firegiant.com/system/files/samples/SampleMergeModule.zip)
をダウンロードすることが出来ます。マージ・モジュールは、個別にビルドする必要があります。

> 訳註：SampleMergeModulet の日本語版は [Sample-4-5-MergeModule.zip](/samples/Sample-4-5-MergeModule.zip) です。

{% highlight bat %}
candle.exe Module1.wxs
light.exe Module1.wixobj

candle.exe Module2.wxs
light.exe Module2.wixobj

candle.exe SampleMerge.wxs
light.exe SampleMerge.wixobj
{% endhighlight %}
