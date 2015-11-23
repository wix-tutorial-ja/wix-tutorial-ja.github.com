---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 8 ユーザー・インタフェイス再び / 3. 相互作用
current: ch08-03
prev: 02-tuning-up
prev-title: 2. チューニング・アップ
next: 04-customizations-galore
next-title: 4. 相互作用
origin: /user-interface-revisited/interactions/
---
# Lesson 8 ユーザー・インタフェイス再び

## 3. 相互作用

ダイアログを作成することは、どちらかと言えば単純です
(ページに配置できるコントロールのタイプはもっと沢山ありますが)。
本当に面白いのは、ダイアログ同士を相互作用させることです。
SampleCustomUI3 では、第二のダイアログを追加して、ユーザーがインストールのプロセスをキャンセルすることが出来るようにします。

![CancelDlg](/images/customcancel.png)

この目的を達するためには、ダイアログそのものが必要です。
ダイアログは二つのプッシュ・ボタンを持ちますが、用語の違いに気を付けて下さい。
このようなダイアログ・ボックスは二つの出力を持ち得ます。
すなわち、ダイアログが言う通りにするのを *キャンセル* するか、*オーケー* するかです。
このダイアログでの質問は違う言い方になります。
キャンセルするダイアログをキャンセルするという事は、インストールを続けることに賛成するということです。
従って、第一の、デフォルトのボタン (**いいえ** というテキストを持ったボタン) を、キャンセル・ボタンと呼びます。

    <Dialog Id="CancelDlg" Width="260" Height="85"
        Title="[ProductName] [Setup]" NoMinimize="yes">
      <Control Id="No" Type="PushButton"
          X="132" Y="57" Width="56" Height="17"
          Default="yes" Cancel="yes" Text="[ButtonText_No]">
        <Publish Event="EndDialog" Value="Return">1</Publish>
      </Control>

ユーザーがこのボタンをクリックすると、**Return** の値を持った **EndDialog** イベントが発生します。
その名前が示すように、このイベントは単純にダイアログを終了して、元の操作を再開します。
**Publish** タグは、条件式として、1 という数値を持っています。
1 は常に真と評価されます（0 は偽と評価されます)ので、イベントは無条件に発行されます。

第二の、**はい** というテキストを持ったボタンは、同じ **EndDialog** イベントを発生させますが、**Exit** という別の値を伴います。
この値は、インストールの操作全体を中止するために使われます。

      <Control Id="Yes" Type="PushButton"
          X="72" Y="57" Width="56" Height="17" Text="[ButtonText_Yes]">
        <Publish Event="EndDialog" Value="Exit">1</Publish>
      </Control>

残りは簡単です。テキストとアイコンです。**Binary** タグを追加してパッケージにアイコンを入れることを忘れないで下さい。

      <Control Id="Text" Type="Text"
          X="48" Y="15" Width="194" Height="30">
        <Text>[ProductName] のインストールを中止してよろしいですか？</Text>
      </Control>
    
      <Control Id="Icon" Type="Icon"
          X="15" Y="15" Width="24" Height="24" ToolTip="情報アイコン"
          FixedSize="yes" IconSize="32" Text="[InfoIcon]" />
    </Dialog>
    
    <Binary Id="info" SourceFile="Binary\Info.ico" />

**InstallDlg** ダイアログにも、いくらか修正が必要です。
**Install** ボタンを左へ移動して、**Cancel** ボタンを置く場所を作りました。
この Cancel ボタンが、起動するダイアログの名前を指定して、**SpawnDialog** イベントを発生させます。
前のレッスンで既に述べたように、**SpawnDialog** は新しい子ダイアログを開始しますが、
現在のダイアログは削除せず、ユーザーがその第二のダイアログを終了すると動作を続行します。

      <Control Id="Cancel" Type="PushButton"
          X="304" Y="243" Width="56" Height="17"
          Cancel="yes" Text="[ButtonText_Cancel]">
        <Publish Event="SpawnDialog" Value="CancelDlg">1</Publish>
      </Control>