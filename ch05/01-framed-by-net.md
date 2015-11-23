---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 5 Net と .NET / 1. .NET の枠組み
current: ch05-01
prev: index
prev-title: Lesson 5 Net と .NET
next: 02-bootstrapping
next-title: 2. ブートストラップ
origin: /net-and-net/framed-by-.net/
---
#  Lesson 5 Net と .NET

## 1. .NET の枠組み

ユーザーのコンピュータに .NET Framework が存在するかどうかを調べる必要があるときは、
WiX に付属している WixNetFx 拡張モジュールを使うことが出来ます。
この拡張モジュールは、フレームワークのすべてのバージョンについて、数多くのプロパティを設定します
(完全なリストは WiX のヘルプ・ファイルにあります)。
その中で、最も重要なものは以下のものでしょう。

- *NETFRAMEWORKxx* :
  指定されたバージョンのフレームワークがインストールされている場合にセットされる。
- *NETFRAMEWORKxx_SP_LEVEL* :
  フレームワークのサービス・パックのレベルがセットされる。
- *NETFRAMEWORKxxINSTALLROOTDIR*
  フレームワークのインストール・フォルダがセットされる。

これらすべてのプロパティの値は、**PropertyRef** タグを使ってプロパティを参照するだけで簡単に読むことが出来ます。

    <PropertyRef Id="NETFRAMEWORK10"/>
    <Condition Message='このセットアップを実行するためには、.NET Framework 1.0 がインストールされている必要があります。'>
      <![CDATA[Installed OR NETFRAMEWORK10]]>
    </Condition>

サービス・パックを確認する必要がある場合、フレームワークのバージョンそのものは確認する必要がありません。
SP プロパティは、ベースのフレームワークが存在している場合にしか、セットされないからです。
しかし、まず最初にそもそもプロパティが設定されているかどうかをチェックして、それから、
実際にどういう値がセットされているかのチェックに進む必要があります。

    <PropertyRef Id="NETFRAMEWORK20_SP_LEVEL"/>
    <Condition Message='このセットアップを実行するためには、.NET Framework 2.0 と Service Pack 1 がインストールされている必要があります。'>
      <![CDATA[Installed OR (NETFRAMEWORK20_SP_LEVEL AND NETFRAMEWORK20_SP_LEVEL = "#1")]]>
    </Condition>

最近のフレームワークのバージョンでは、利用可能なプロパティが追加されています。

    <PropertyRef Id="NETFRAMEWORK35_CLIENT"/>
    <Condition Message='このセットアップを実行するためには、.NET Framework 3.5 Client Profile がインストールされている必要があります。'>
      <![CDATA[Installed OR NETFRAMEWORK35_CLIENT]]>
    </Condition>

インストーラをリンクするときには、*WixNetFxExtension* モジュールをリンクするのを忘れないようにして下さい。

    candle.exe SampleDotNET.wxs
    light.exe -ext WixNetFxExtension SampleDotNET.wixobj

完全な [SampleDotNET](https://www.firegiant.com/system/files/samples/SampleDotNET.zip) をダウンロードすることが出来ます。

> 訳註：SampleDotNET の日本語版は [Sample-5-1-DotNET.zip](/samples/Sample-5-1-DotNET.zip) です。