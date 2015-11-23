---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 8 ユーザー・インタフェイス再び / 2. チューニング・アップ
current: ch08-02
prev: 01-a-single-dialog
prev-title: 1. 一つだけのダイアログ
next: 03-interactions
next-title: 3. 相互作用
origin: /user-interface-revisited/tuning-up/
---
# Lesson 8 ユーザー・インタフェイス再び

## 2. チューニング・アップ

SampleCustomUI2 は、引き続いて一つだけのダイアログですが、ほんの少しチューン・アップします。

![SampleCustomUI2 InstallDlg](/images/customwelcome.png)

    <Dialog Id="InstallDlg" Width="370" Height="270"
        Title="[ProductName] [Setup]" NoMinimize="yes">

これは、ほんの小さな変更ですが、ボタンのテキストを直接指定せずに、プロパティを使います。
これによって、後の段階で地域化することが容易になります。

      <Control Id="Install" Type="PushButton"
          X="304" Y="243" Width="56" Height="17"
          Default="yes" Text="[ButtonText_Install]">
        <Publish Event="EndDialog" Value="Return" />
      </Control>

ダイアログの上部に簡単なバナー・ビットマップを配置します。
バイナリの添付データを参照するのにプロパティを使うことを覚えておいて下さい。
**Text** 属性として指定されていますが、これはテキストではなく、パッケージに保存されているビットマップの **Id** です。

      <Control Id="BannerBitmap" Type="Bitmap"
          X="0" Y="0" Width="370" Height="44"
          TabSkip="no" Text="[BannerBitmap]" />

テキストを二行追加します。
一つは、バナー・ビットマップの上に置く、背景が透明なもの、もう一つは、実際のダイアログ・ワーク・エリアの上に置くものです。

      <Control Id="Description" Type="Text"
          X="25" Y="23" Width="280" Height="15"
          Transparent="yes" NoPrefix="yes">
        <Text>[Wizard] がインストールを開始する準備が完了しました。</Text>
      </Control>
    
      <Control Id="Text" Type="Text"
          X="25" Y="70" Width="320" Height="20">
        <Text>[\[]インストール[\]] をクリックして、インストールを開始して下さい。</Text>
      </Control>

ダイアログ・ワーク・エリアの下端を示す水平線を置きます — 見た目だけのものに過ぎません。

      <Control Id="BottomLine" Type="Line"
          X="0" Y="234" Width="370" Height="0" />

最後に、タイトルを置き、バナー・ビットマップのすぐ下にエンボス・ラインを置きます。

      <Control Id="Title" Type="Text"
          X="15" Y="6" Width="200" Height="15"
          Transparent="yes" NoPrefix="yes">
        <Text>{\DlgTitleFont}インストール準備完了</Text>
      </Control>
    
      <Control Id="BannerLine" Type="Line"
          X="0" Y="44" Width="370" Height="0" />
    </Dialog>

バナー・ビットマップを参照したことを忘れずに、それをパッケージに含めましょう。

    <Binary Id="bannrbmp" SourceFile="Binary\Banner.bmp" />