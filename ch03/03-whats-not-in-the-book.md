---
layout: default
title: WiX チュートリアル 日本語訳 - Lesson 3 - イベントとアクション / 3. 本に書かれていないこと
current: ch03-03
prev: 02-extra-actions
prev-title: 2. 追加のアクション
next: 04-control-your-controls
next-title: 4. コントロールをコントロールせよ
origin: /events-and-actions/whats-not-in-the-book/
---
# Lesson 3 - イベントとアクション

## 3. 本に書かれていないこと

Windows Installer が解決方法を提供してくれない非常に特殊なアクション
(例えば、ユーザーが入力した登録キーの妥当性と整合性をチェックすること)
に対しては、もう一つ別のタイプのカスタム・アクションを使うことが出来ます。
すなわち、私たちが書く DLL です。
ここでは、例として、ユーザー・キーの最初の数字が '1' であれば承認する、という極めて安直な手法を使います。

以下のソースは Visual C++ ではそのままコンパイル出来ます。
別のコンパイラでコンパイルする場合でも、必要な修正は、(有るとしても)ほんの少しでしょう。
ヘッダ・ファイル、**msi.h** と **msiquery.h** は、MSI SDK から取得できます。更に **msi.lib** もリンクする必要があります。

    #include <windows.h>
    #include <msi.h>
    #include <msiquery.h>

    #pragma comment(linker, "/EXPORT:CheckPID=_CheckPID@4")

    extern "C" UINT __stdcall CheckPID (MSIHANDLE hInstall) {
      char Pid[MAX_PATH];
      DWORD PidLen = MAX_PATH;
    
      MsiGetProperty(hInstall, "PIDKEY", Pid, &PidLen);
      MsiSetProperty(hInstall, "PIDACCEPTED", Pid[0] == '1' ? "1" : "0");
      return ERROR_SUCCESS;
    }

この DLL を使うために、下記の数行を適切な場所に追加します
(今や、三回目のレッスンの終り近くですから、これぐらいは自分で出来るでしょうが、
ずるをしたい場合は、[SampleCA](https://www.firegiant.com/system/files/samples/SampleCA.zip) をダウンロードして下さい)。

> 訳註：SampleCA の日本語版は [Sample-3-3-CA.zip](/samples/Sample-3-3-CA.zip) です。

    <Condition Message='このインストーラは完全 UI モードでのみ実行出来ます。'>
      <![CDATA[UILevel = 5]]>
    </Condition>

    <CustomAction Id='CheckingPID' BinaryKey='CheckPID'
        DllEntry='CheckPID' />
    <CustomAction Id='RefusePID'
        Error='無効なキーです。インストールを中止します。' />

    <InstallExecuteSequence>
      <Custom Action='CheckingPID' After='CostFinalize' />
      <Custom Action='RefusePID' After='CheckingPID'>
        PIDACCEPTED = "0" AND NOT Installed
      </Custom>
    </InstallExecuteSequence>

    <Binary Id='CheckPID' SourceFile='CheckPID.dll' />

簡単に説明します。最初に、私たちはこのインストーラが簡易 UI モードや UI 無しのモードで走ることを許可しません。
なぜなら、それらのモードでは、ユーザーが登録キーを入力することが出来ないからです。
醜い CDATA ラッパーを使っている理由は、XML がいくつかの文字、とりわけ **"<"** と **">"** に特別な意味を与えているからです。
これらの文字が、*より小さい* や *より大きい* を意味する別の文脈で出現する場合には、
常に、式全体を CDATA に入れてエスケープしなければなりません。
この実例の場合は、等価であることをチェックしているだけなので、エスケープしなくても済みます。
しかし、このような条件式をすべて CDATA で包むようにするのは、良い習慣です。
そうしておけば、万一、後で条件を修正する必要があっても、そういう XML の衝突を招かずに済みます。

次に、*CheckingPID* という名前のカスタム・アクションを *CostFinalize* の後に走らせます。
すなわち、どの機能が必要で、どこにインストールしたいかを決定した後、インストーラに実際のインストールを開始するように指示する時です。
このカスタム・アクションは、インストーラに同梱されている **CheckPID.dll** の *CheckPID* という関数を呼び出します。
DLL は、関連するコントロールによって入力されて **PIDKEY** プロパティに保存されているユーザー・キーの正当性を判断して、
**PIDACCEPTED** プロパティを `1` または `0` に設定します。
カスタム・アクションとの間で引数を渡したり戻り値を受け取ったりするためには、
プロパティを使うしか方法がないということを覚えておいて下さい。
また、そのプロパティの名前はすべて大文字でなければなりません。
そうでないと、Windows Installer はそのプロパティを public なものとは見なしません。

そして、*RefusePID* という名前の第二のカスタム・アクションを第一のアクションの後に走らせるように予定します。
これは条件付きのカスタム・アクションで、戻り値の **PIDACCEPTED** プロパティがゼロであった場合にだけ走らせます。
その場合、このカスタム・アクションはエラー・メッセージを表示して、インストールを中止します。
ただし、私たちが PIDACCEPTED の値に関心を持つのは、インストールの時だけです。
製品をアンインストールする場合には、PIDACCEPTED の値を問題にしません。

これらのアクションがどのように呼び出され、お互いにどのように関係しているのかを理解するためには、
詳細ロギングを有効にしてインストーラを走らせてみるのが良いでしょう。
ログは本当に詳細なものになりますから、実際に起っている事を記録している箇所を探すためには、
テキスト・エディタを使って、プロパティやカスタム・アクションの名前(“PID”でも大丈夫です)を検索するのが良いでしょう。

    msiexec /i SampleCA.msi /l*v SampleCA.log

呼び出す必要がある DLL が単にパッケージに含まれているのではなくて、インストールされている場合は、次のように記述することが出来ます。

    <CustomAction Id='CheckingPID' FileKey='HelperDLL'
        DllEntry='CheckPID' />