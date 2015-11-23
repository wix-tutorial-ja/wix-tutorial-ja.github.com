---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 8 ユーザー・インタフェイス再び / 6. よく出来ました
current: ch08-06
prev: 05-is-this-progress
prev-title: 5. これが進捗ですか
next: 07-legalese
next-title: 7. 法律用語
origin: /user-interface-revisited/well-done/
---
# Lesson 8 ユーザー・インタフェイス再び

## 6. よく出来ました

足りないものが一つだけあります。
インストールの後にアプリケーションを起動する方法です。
ここでは、チェックボックスの使い方と、チェックボックスの状態に従って決定を行う方法も示します。

![ExitDlg](/images/customdone.png)

新しく追加されたダイアログはこのような外観です。

    <Dialog Id="ExitDlg" Width="370" Height="270"
        Title="[ProductName] [Setup]" NoMinimize="yes">

**Finish** ボタンは二つの仕事を実行します。
第一に、ダイアログ自身を終了します (そして、それによって、インストーラ・パッケージ自身を終了します)。
第二に、ユーザーがそうすることを選んだ場合に、アプリケーションを起動します。

      <Control Id="Finish" Type="PushButton"
          X="236" Y="243" Width="56" Height="17" 
          Default="yes" Cancel="yes"
          Text="[ButtonText_Finish]">
        <Publish Event="EndDialog" Value="Return">1</Publish>
        <Publish Event='DoAction' Value='LaunchFile'>
          (NOT Installed) AND (LAUNCHPRODUCT = 1)
        </Publish>
      </Control>
      ...

ダイアログ・ボックスの中のチェックボックス・コントロールは、初期設定値 (**CheckBoxValue**)
と、チェックボックスの状態を読むために使われる関連づけられたプロパティ (**LAUNCHPRODUCT**) の両方を持ちます。

      <Control Id="Launch" Type="CheckBox"
          X="135" Y="120" Width="150" Height="17"
          Property='LAUNCHPRODUCT' CheckBoxValue='1'>
        <Text>[ProductName] を起動する</Text>
      </Control>
      ...
    </Dialog>

**Finish** ボタンによって発行されるアクションは既によく知っているカスタム・アクションです。
アプリケーションが走り続けてもインストーラが閉じることが出来るように、**Return** 属性を忘れないようにして下さい。

    <CustomAction Id='LaunchFile' FileKey='HogeEXE' ExeCommand='' 
        Return="asyncNoWait" />

この終了ダイアログは、インストールが成功して完了した場合に表示されるようにスケジュールされます
(詳細は次のセクションを見て下さい)。

    <InstallUISequence>
      ...
      <Show Dialog="ExitDlg" OnExit="success" />
    </InstallUISequence>

チェックボックスとプロパティがリンクされるのはイベントが発生する時、すなわちユーザーがチェックを入れたり外したりする時だけです。
初期状態では、ユーザーとの相互作用がまだ無いため、プロパティが **Control**
タグで設定したデフォルト値を受け取る機縁となるものはありません。
従って、必ず私たち自身がプロパティを初期化しなければなりません。

    <Property Id="LAUNCHPRODUCT">1</Property>

SampleCustomUI6 をビルドする前に、ダミーの `.exe` ファイルを何か実際に起動するものに必ず置き換えて下さい。

> 訳註：サンプルの日本語版 ([Sample-8-1-CustomUI.zip](/samples/Sample-8-1-CustomUI.zip))
> には起動するプログラムが同梱されています (実は最初のレッスンの日本語版サンプルから、ずっと、そうしています)。

そして、よくある不満について。そう、チェックボックスは透明の背景を持つことが出来ません。
ちょうど上に示した例のように、背景にビットマップがあると不格好な表示になります。
唯一の回避策は、チェックボックスの幅をボックス自体の実際の幅まで縮小して、
その隣に追加のスタティック・テキスト (これは背景を透明に出来ます) を置くことです。