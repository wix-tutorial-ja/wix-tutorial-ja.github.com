---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 10 標準ライブラリ / 2. お静かに願います
current: ch10-02
prev: 01-custom-actions-and-user-interface
prev-title: 1. カスタム・アクションとユーザー・インタフェイス
next: /download
next-title: ダウンロード
origin: /standard-libraries/silence-please/
---
# Lesson 10 標準ライブラリ

## 2. お静かに願います

実行ファイルを開始するためには標準のカスタム・アクションが使えますが、
起動されるプログラムが普通のグラフィカルなユーザー・インタフェイスを持っていないコンソール・アプリケーションである場合には、
それが最善の方法ではないかも知れません。
この場合、コマンド・ライン・コンソールが一瞬だけ開くのを避けたいのではないでしょうか。

標準の WixUtil ライブラリに、そういう場合にちょうど良い **CAQuietExec** という特殊なカスタム・アクションがあります。
このカスタム・アクションを使うためには、**QtExecCmdLine** という定義済みのプロパティに実行すべきコマンド・ラインを入れなければなりません。
コマンドの実行は、即時でも遅延でも構いません。

    <Property Id="QtExecCmdLine" Value="something.exe"/>
    <CustomAction Id="SilentLaunch" BinaryKey="WixCA"
        DllEntry="CAQuietExec"
        Execute="immediate" Return="check" />
    
    <InstallExecuteSequence>
      <Custom Action="SilentLaunch" After="..." />
    </InstallExecuteSequence>

64-bit の実行ファイルを実行するためには、**CAQuietExec64** および **QtExec64CmdLine** を代りに使って下さい。

ビルドするためには、この標準ライブラリをリンクしなければなりません。

    candle.exe Sample.wxs
    light.exe -ext WixUtilExtension Sample.wixobj