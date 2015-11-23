---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 10 標準ライブラリ / 1. カスタム・アクションとユーザー・インタフェイス
current: ch10-01
prev: index
prev-title: Lesson 10 標準ライブラリ
next: 02-silence-please
next-title: 2. お静かに願います
origin: /standard-libraries/custom-actions-and-user-interface/
---
# Lesson 10 標準ライブラリ

## 1. カスタム・アクションとユーザー・インタフェイス

[SampleListbox](https://www.firegiant.com/system/files/samples/SampleListbox.zip) は、どのようにすれば、
ユーザー・インタフェイスに表示されるデータをカスタム・アクションで収集することが出来るかを示しています。
これを実現するために、WiX に付属している WcaUtil カスタム・アクション・ライブラリを使います。
このライブラリは、C++ でカスタム・アクションを書くことを容易にしてくれる多くのユーティリティ関数を持っています。
その中には、プロパティを生の形式および整形された形式で取得および設定する関数や、インストーラ・データベースを修正する関数や、
Windows Installer のログ・ファイルにログを吐く関数なども含まれています。

> 訳註：SampleListbox の日本語版は [Sample-10-1-Listbox.zip](/samples/Sample-10-1-Listbox.zip) です。

組み込みの UI をわずかに修正して、新しいダイアログ、**InstallDlg** を作成します。
どうやってこれを実現するかは、これまでのレッスンで既に見ています。
つまり、ここには、まだ知らないものは何もありません。
カスタム・アクションを定義してスケジュールします。
リストボックスをパブリックなプロパティにリンクされるように定義します。

    <CustomAction Id="FillingListbox" BinaryKey="FillListbox" 
        DllEntry="FillListbox" />
    
    <UI>
      <Dialog Id="InstallDlg" Width="370" Height="270"
          Title="[ProductName] [Setup]" NoMinimize="yes">
        ...
        <Control Id="FilledListbox" Type="ListBox" Sorted="yes"
            Indirect="no" Property="LISTBOXVALUES" 
            X="10" Y="50" Width="200" Height="130" />
      </Dialog>
    
      <InstallUISequence>
        <Custom Action="FillingListbox" After="CostFinalize" />
        <Show Dialog="InstallDlg" After="FillingListbox" />
      </InstallUISequence>
    </UI>
    
    <Binary Id="FillListbox" SourceFile="FillListbox.dll" />

> 訳註：リストボックスで選択された項目を調べて使用する方法については、日本語のサンプルを参照して下さい。

カスタム・アクションは、Wca 関数を使って、インストーラとの接続を初期化したりクローズしたり、
パブリックなプロパティに現れる値を挿入したりします。
そして、このプロパティに接続されているリストボックスにその値が反映されます。

    #include <windows.h>
    #include <msi.h>
    #include <msiquery.h>
    #include "wcautil.h"
    
    #pragma comment(linker, "/EXPORT:FillListbox=_FillListbox@4")
    
    extern "C" UINT __stdcall FillListbox(MSIHANDLE hInstall) {
      HRESULT hResult = WcaInitialize(hInstall, "FillListbox");
      if (FAILED(hResult)) return ERROR_INSTALL_FAILURE;
    
      MSIHANDLE hTable = NULL;
      MSIHANDLE hColumns = NULL;
    
      hResult = WcaAddTempRecord(&hTable, &hColumns, L"ListBox", 
          NULL, 0, 3, L"LISTBOXVALUES", 1, L"いも", L"Item 1");
      hResult = WcaAddTempRecord(&hTable, &hColumns, L"ListBox",
          NULL, 0, 3, L"LISTBOXVALUES", 2, L"たこ", L"Item 2");
      hResult = WcaAddTempRecord(&hTable, &hColumns, L"ListBox", 
          NULL, 0, 3, L"LISTBOXVALUES", 3, L"なんきん", L"Item 3");
    
      if (hTable)
        MsiCloseHandle(hTable);
      if (hColumns)
        MsiCloseHandle(hColumns);
      return WcaFinalize(hResult);
    }

この DLL をビルドするときには、msi.lib の他に、dutil.lib と wcautil.lib もリンクしなければなりません。
これらのファイルは WiX ツールセットとともにインストールされています。