---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 3 イベントとアクション / 6. 後の段階で
current: ch03-06
prev: 05-how-to-manage
prev-title: 5. マネージする方法
next: /ch04/index
next-title: Lesson 4 アップグレードとモジュラー化
origin: /events-and-actions/at-a-later-stage/
---
# Lesson 3 イベントとアクション

## 6. 後の段階で

カスタム・アクションは、シーケンス・テーブルに行を挿入することによって、プロパティをセットしたり、
機能やコンポーネントの状態を変更したり、インストール先ディレクトリを設定したり、あるいはシステムの操作をスケジュールしたりします。
たいていの場合、それらのカスタム・アクションは即時に実行しても支障の無いものです。
しかし、システムを直接に変更したり、他のシステム・サービスを呼んだりする必要があるカスタム・アクションは、
インストール・スクリプトが実行される時まで延期されなければなりません。
Windows Installer は、こういう *遅延実行の(deferred)* カスタム・アクションをインストール・スクリプトに書き込んで、後で実行します。

遅延実行のカスタム・アクションは、下記のように定義します。

{% highlight xml %}
<CustomAction Id="MyAction" Return="check" Execute="deferred"
    BinaryKey="CustomActionsLibrary" DllEntry="MyAction"
    HideTarget="yes"/>
{% endhighlight %}

**Execute** 属性が、カスタム・アクションが遅延実行されるものであることを指し示しています。
呼び出さなければならない DLL 関数を **DllEntry** 属性で参照しなければなりません
(コンパイル環境が要求する場合は **\_MyAction@4** のような C++ スタイルの関数名に対する装飾を忘れないで下さい)。
そして、最後に、セキュリティー上の判断が命ずる場合は、**HideTarget** を指定して、
このカスタム・アクションに渡される引数のロギングを無効にすることが出来ます。

インストール・スクリプトは通常のインストール・セッションの外で実行されますので、
遅延実行のアクションが実行される時には元のセッションはもう存在しません。
元のセッションのハンドルも、元のインストールのシーケンスで設定されたプロパティ・データも、遅延実行アクションからは使うことが出来ません。
遅延実行のアクションが取得できる非常に限られた量の情報は、以下の三つのプロパティから成り立っています。

- *CustomActionData* :
  カスタム・アクションがシーケンス・テーブルで処理される時の値。
  このプロパティは遅延実行のカスタム・アクションだけが使用出来るもので、即時実行のカスタム・アクションからはアクセス出来ません。
- *ProductCode* :
  製品の一意の GUID コード。
- *UserSID* :
  ユーザーのセキュリティー識別子(SID)。インストーラによってセットされます。

遅延実行のアクションに他のプロパティ・データを渡す必要がある場合は、その値を前もって設定する第二のカスタム・アクションを使うことが出来ます。
一番簡単な解法はプロパティ設定のカスタム・アクションです。
設定されるプロパティの名前が遅延実行のカスタム・アクションの **Id** 属性と同じになるように設定して下さい。

{% highlight xml %}
<Property Id="SOME_PUBLIC_PROPERTY">
  こんにちは、遅延実行 CA です。
</Property>
<CustomAction Id="MyAction.SetProperty" Return="check"
    Property="MyAction" Value="[SOME_PUBLIC_PROPERTY]" />
{% endhighlight %}

プロパティの設定を遅延実行のアクションの前にスケジュールすることも重要です。

{% highlight xml %}
<InstallExecuteSequence>
  <Custom Action="MyAction.SetProperty" After="ValidateProductID" />
  <Custom Action="MyAction" After="MyAction.SetProperty" />
</InstallExecuteSequence>
{% endhighlight %}

渡そうとしたデータは、**CustomActionData** プロパティの中に出現します。
複数の情報を渡す必要がある場合は、それらをこの単一のプロパティに組み入れる方法を工夫しなければなりません。
例えば、セミコロンで区切られた **Name=Value** のペアのリストを使う等です。

{% highlight c %}
#include <windows.h>
#include <msi.h>
#include <msiquery.h>
#include <tchar.h>

#pragma comment(linker, "/EXPORT:MyAction=_MyAction@4")

extern "C" UINT __stdcall MyAction (MSIHANDLE hInstall) {
  TCHAR szActionData[MAX_PATH] = {0};
  DWORD dActionDataLen = MAX_PATH;

  MsiGetProperty(hInstall, _T("CustomActionData"), szActionData,
      &dActionDataLen);
  MessageBox (NULL, szActionData, _T("遅延実行のカスタムアクション"),
      MB_OK | MB_ICONINFORMATION);
  return ERROR_SUCCESS;
}
{% endhighlight %}
