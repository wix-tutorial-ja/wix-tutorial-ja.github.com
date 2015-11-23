---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 3 イベントとアクション / 4. コントロールをコントロールせよ
current: ch03-04
prev: 03-whats-not-in-the-book
prev-title: 3. 本に書かれていないこと
next: 05-how-to-manage
next-title: 5. マネージする方法
origin: /events-and-actions/control-your-controls/
---
# Lesson 3 イベントとアクション

## 4. コントロールをコントロールせよ

いや、確かに、前の章で私たちがしたことは、エレガントではありませんでした。
私たちは、後の段階になってからインストールを中止するのではなく、ユーザーがキーを入力するその場でチェックし、
警告を表示して、キーを入力し直すチャンスをユーザーに提供するべきです。
どうすればそれを達成できるか、見ていきましょう。

カスタム・アクションは、二種類のユーザー・インタフェイス・コントロール、プッシュ・ボタンとチェック・ボックスにリンクすることが出来ます。
このリンクを実行するためには、既に知っている **Publish** タグを使います。**Value** 属性がカスタム・アクションの名前を保持します。

    <Control Id="..." Type="PushButton" ...>
      <Publish Event="DoAction" Value="CheckingPID">1</Publish>
    </Control>

このようにすると、ユーザーが「ユーザー情報」ページの「次へ」ボタンを押した時に、DLL を呼ぶカスタム・アクションが引き起こされます。
カスタム・アクションはこの UI イベントにリンクされますので、もう **InstallExecuteSequence** タグの中にスケジュールする必要は有りません。
ただし、カスタム・アクションの定義はソースの中に残ります。

    <CustomAction Id='CheckingPID' BinaryKey='CheckPID'
        DllEntry='CheckPID' />

ユーザーに警告をするためにメッセージ・ボックスが要ります。
これも、また、前に作成した「ユーザー情報」ページと同じようなダイアログです。
前と同じように、断片(fragment)として独立したソース・ファイルに入れて、**DialogRef** タグを使って参照することも出来ます。
しかし、ここでは、もう一つの解法があることを示すために、直接にメインのソース・ファイルの UI セクションの直下で定義することにします。

    <Dialog Id="InvalidPidDlg" Width="260" Height="85"
        Title="[ProductName] [Setup]" NoMinimize="yes">
      <Control Id="Icon" Type="Icon"
          X="15" Y="15" Width="24" Height="24"
          ToolTip="Information icon" FixedSize="yes" IconSize="32"
          Text="Exclam.ico" />
      <Control Id="Return" Type="PushButton"
          X="100" Y="57" Width="56" Height="17"
          Default="yes" Cancel="yes" Text="&amp;Return">
        <Publish Event="EndDialog" Value="Return">1</Publish>
      </Control>
      <Control Id="Text" Type="Text"
          X="48" Y="15" Width="194" Height="30" TabSkip="no">
        <Text>
          入力されたユーザー・キーは無効です。
          インストール CD のケースのラベルに印刷されているキーを入力してください。
        </Text>
      </Control>
    </Dialog>

「ユーザー情報」ページも更新しなければなりません。
と言うのは、このダイアログからカスタム・アクションと新しいメッセージ・ボックスを呼び出さなければならないからです。

    <Control Id="Next" Type="PushButton"
        X="236" Y="243" Width="56" Height="17"
        Default="yes" Text="[ButtonText_Next]">
      <Publish Event="DoAction" Value="CheckingPID">1</Publish>
      <Publish Event="SpawnDialog"
          Value="InvalidPidDlg">PIDACCEPTED = "0"</Publish>
      <Publish Event="NewDialog"
          Value="SetupTypeDlg">PIDACCEPTED = "1"</Publish>
    </Control>

さあ、これで、ユーザーが「次へ」ボタンを押すと、DLL の中の関数が呼ばれます
(条件である `1` が **真** に評価されるため、毎回呼ばれます)。
DLL の中の関数は **PIDKEY** プロパティをチェックして、キーが承認されたかどうかを示すために **PIDACCEPTED** をセットします。
承認された場合は、**SetupTypeDlg** へと進みます。承認されなかった場合は、エラー・メッセージを表示します。

あと一つだけ、小さな項目が残っています。
メッセージ・ボックスの中でアイコンに言及していますので、これもインストーラの中に入れなければなりません。

      <Binary Id="Exclam.ico" SourceFile="Exclam.ico" />

全体のソースは、[SampleAskKey](https://www.firegiant.com/system/files/samples/SampleAskKey.zip) として、ダウンロードすることが出来ます。

> 訳註：SampleAskKey の日本語版は [Sample-3-4-AskKey.zip](/samples/Sample-3-4-AskKey.zip) です。

ところで、ログ・ファイルにユーザー・キーが出現するのは、必ずしも、良いことでも安全なことでもありません。
これを回避するためには、以下のように記述します。

    <Property Id="PIDKEY" Hidden='yes' />
