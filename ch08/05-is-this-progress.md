---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 8 ユーザー・インタフェイス再び / 5. これが進捗ですか
current: ch08-05
prev: 04-customizations-galore
prev-title: 4. 相互作用
next: 06-well-done
next-title: 6. よく出来ました
origin: /user-interface-revisited/is-this-progress/
---
# Lesson 8 ユーザー・インタフェイス再び

## 5. これが進捗ですか

成長している私たちのユーザー・インタフェイスにまだ欠けているものがあります。
インストール・プロセスがどのように進捗しているかを示すページです。

![ProgressDlg](/images/customprogress.png)

私たちはこのダイアログを *モードレス* であると定義します。
というのは、制御をインストーラに戻す必要があるからです。
そうやって、インストーラからダイアログに対して処理すべき進捗メッセージを送るようにします。

    <Dialog Id="ProgressDlg" Width="370" Height="270"
        Title="[ProductName] [Setup]" Modeless="yes">

**Back** ボタンと **Next** ボタンはデフォルトで無効化されます — 有効にしておく理由はありません。
どっちみち、ユーザーはこれらのボタンを使うことが出来ません。
必要であれば、**Cancel** ボタンを使ってインストールを中止することが出来ます。

      <Control Id="Cancel" Type="PushButton"
               X="304" Y="243" Width="56" Height="17" 
               Default="yes" Cancel="yes"
               Text="[ButtonText_Cancel]">
        <Publish Event="SpawnDialog" Value="CancelDlg">1</Publish>
      </Control>
      <Control Id="BannerBitmap" Type="Bitmap"
               X="0" Y="0" Width="370" Height="44"
               TabSkip="no" Text="[BannerBitmap]" />
      <Control Id="Back" Type="PushButton"
               X="180" Y="243" Width="56" Height="17" Disabled="yes"
               Text="[ButtonText_Back]" />
      <Control Id="Next" Type="PushButton"
               X="236" Y="243" Width="56" Height="17" Disabled="yes"
               Text="[ButtonText_Next]" />

プログレス・バーのすぐ上にあるテキストは **ActionText** イベントを予約していますので、
インストーラは現在実行しているインストールのアクション名をテキストに対して継続的に発行します。

      <Control Id="ActionText" Type="Text"
          X="70" Y="100" Width="265" Height="10">
        <Subscribe Event="ActionText" Attribute="Text" />
      </Control>

主要なステップの説明だけでは満足できず、個別のファイルが配置されるときにその詳細な情報を見たいという場合は、
**ActionData** イベントを代りに使うことも出来ます。

      <Control Id="ActionData" Type="Text"
          X="70" Y="100" Width="265" Height="30">
        <Subscribe Event="ActionData" Attribute="Text" />
      </Control>

興味を引かないいくつかのコントロールに加えて、最後にこのダイアログの主役である **ProgressBar** タイプのコントロールを追加します。
**SelectionTree** と同じように、インストーラによって提供されるこのコントロールは単なる標準のプログレス・バーではなくて、
インストールの過程と直接にリンクされたものです。
**SetProgress** イベントを **Progress** 属性で予約することによって、表示する進捗メッセージをインストーラから受け取り続けます。
**ProgressBlocks = yes** はブロック化された新しいタイプのプログレス・バーを指定しています。
これを *no* の設定にすると、Windows 95 時代からの古いスタイルの連続的なバーに立ち帰ります。

      <Control Id="ProgressBar" Type="ProgressBar"
          X="35" Y="115" Width="300" Height="10"
          ProgressBlocks="yes" Text="Progress done">
        <Subscribe Event="SetProgress" Attribute="Progress" />
      </Control>
    
      <Control Id="StatusLabel" Type="Text"
          X="35" Y="100" Width="35" Height="10"
          Text="Status:" />
    </Dialog>

進捗ページをインストーラ・パッケージの残りの部分と結合するために必要なことは、
**InstallDlg** ダイアログを修正してこのダイアログを呼ぶようにすることだけです。
残りの作業は魔法のごとく自動的に行われます。

    <Dialog Id="InstallDlg" Width="370" Height="270"
        Title="[ProductName] [Setup]" NoMinimize="yes">
      <Control Id="Install" Type="PushButton"
          X="236" Y="243" Width="56" Height="17" Default="yes"
          Text="[ButtonText_Install]">
        <Publish Event="NewDialog" Value="ProgressDlg" />
      </Control>