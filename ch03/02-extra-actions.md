---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 3 イベントとアクション / 2. 追加のアクション
current: ch03-02
prev: 01-queueing-up
prev-title: 1. 列に並んで
next: 03-whats-not-in-the-book
next-title: 3. 本に書かれていないこと
origin: /events-and-actions/extra-actions/
---
# Lesson 3 イベントとアクション

## 2. 追加のアクション

[スタンダード・アクション](http://msdn.microsoft.com/en-us/library/windows/desktop/aa372023(v=vs.85).aspx)
には、この他にも、既定ではスケジュールされない利用可能なアクションが数多くあります。
例えば、**ScheduleReboot** は、インストールの後でシステムを再起動するようにユーザーに指示します。

    <InstallExecuteSequence>
      <ScheduleReboot After='InstallFinalize' />
    </InstallExecuteSequence>

再起動の必要性が何らかの条件(例えば、インストーラが走っているオペレーティング・システム)に依存する場合は、条件文を使います。

    <InstallExecuteSequence>
      <ScheduleReboot After='InstallFinalize'>Version9X</ScheduleReboot>
    </InstallExecuteSequence>

予定に入れたり予定を変更したり出来るのは、いわゆるスタンダード・アクションだけではありません。
二～三のカスタム・アクションも同様に出来ます
(ここで言う**カスタム**とは、通常のイベントの進行には出現しないけれども、望むときには、いつでもどこでも使うことが出来る、という意味です)。
非常によくある要望として、インストールしたアプリケーションを起動したい、というものがあります。

カスタム・アクションはソース・ファイルの二箇所で言及しなければなりません。
第一に、**Product** タグの子供として(例えば、**Feature** の終了タグと **UI** の開始タグの間で)、カスタム・アクションを定義します。
この **CustomAction** タグで何をするかを指定します。
インストールした実行ファイルを起動する場合は、そのファイルを定義している **File** タグの **Id** 識別子を使って実行ファイルを参照します。
コマンド・ラインも指定しなければなりませんが、必要でなければ空文字列にしておくことも出来ます。

    <CustomAction Id='LaunchFile' FileKey='FoobarEXE'
        ExeCommand='' Return='asyncNoWait' />

第二に、通常と同じ方法で、アクションを予定に入れなければなりません。
アクションとスケジュール項目の間のリンクは、**Id** — **Action** の整合する属性のペアで指定します。
カスタム・アクションの実行に条件がある場合は、**Custom** タグの中で条件を定義することが出来ます。
ここでは、インストールを実行する場合にだけ実行ファイルを起動し、製品を削除するときは起動しないように、条件を設定する必要があります。

    <InstallExecuteSequence>
      ...
      <Custom Action='LaunchFile' 
          After='InstallFinalize'>NOT Installed</Custom>
    </InstallExecuteSequence>

> 訳註：上記ソース断片の NOT Installed は、間違いではありません。
> Installed は、製品がインストールされているかどうかを示す定義済みプロパティですが、
> その値が取得されるのは、インストーラの初期化時であり、完了時ではありません。
> 従って、インストールを実行するときの Installed は、false になっています。

場合によっては、インストーラ・パッケージに入れて持ち回るけれども、ユーザーのマシンにはインストールしたくないヘルパー・ユーティリティ
(例えば、readme ファイルのビュワーや、特別な設定ユーティリティ)を起動したいことがあります。
その場合は、**File** ではなく、**Binary** タグの識別子を参照するようにします。スケジューリングの方法は同じです。

    <CustomAction Id='LaunchFile' BinaryKey='FoobarEXE'
        ExeCommand='' Return='asyncNoWait' />

また、ユーザーのマシン上にある他のどんな実行ファイルでも、プロパティで名前を指定すれば、起動することが出来ます。

        <Property Id='NOTEPAD'>Notepad.exe</Property>
        <CustomAction Id='LaunchFile' Property='NOTEPAD'
            ExeCommand='[SourceDir]Readme.txt' Return='asyncNoWait' />

カスタム・アクションは、**Return** 属性を使って、アクションの完了をどのように扱うかを指定することも出来ます。
指定できる値は以下の通りです — *check* は、カスタム・アクションの完了を待って、その戻り値をチェックします。
*ignore* は、アクションの完了を待ちますが、戻り値は無視します。
*asyncWait* は、非同期的にアクションを走らせますが、インストーラはスケジュールされた一連のイベントの最後で、
アクションから戻り値が返ってくるのを待ちます。
そして、*asyncNoWait* は、単にアクションを起動して、その後は放置します。
この場合、起動されたアクションは、インストーラが終了した後も走り続けることが出来ます。
インストール完了後にアプリケーションを起動したり、readme ファイルを表示したりする場合は、この最後の値を使います。

通常の機構では表示できないエラーに遭遇した場合に、エラー・メッセージを表示してインストールを終了することが出来ます。
**Error** 属性には、実際のメッセージのテキストを入れることも、**Error** タグの **Id** 識別子を入れることも出来ます。

    <CustomAction Id='AbortError' Error='この謎は解けません。諦めます。' />

プロパティの値を別のプロパティの値に割り当てる直接的な方法はありません。
しかし、カスタム・アクションを使うと、この間隙を乗り越えることが出来ます。
**Value** 属性は書式指定文字列でも構いませんので、ちょっとした文字列操作もすることが出来ます
(パスの参照には、常に末尾のバックスラッシュが自動的に追加されている事に注意して下さい。
バックスラッシュをもう一つ余計に追加する必要はありません)。

    <CustomAction Id='PropertyAssign' Property='PathProperty'
        Value='[INSTALLDIR][FilenameProperty].[ExtensionProperty]' />

ディレクトリも、同様のパスを示す書式指定文字列として設定することが出来ます。

    <CustomAction Id='PropertyAssign' Directory='INSTALLDIR'
        Value='[TARGETDIR]\Program Files\Acme\Foobar 1.0\bin' />