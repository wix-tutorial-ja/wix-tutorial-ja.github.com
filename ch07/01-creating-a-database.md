---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 7 SQL / 1. データベースを作成する
chapter: ch07
current: ch07-01
prev: /ch06/12-version-by-version
prev-title: 12. バージョンごとに
next: /ch08/index
next-title: Lesson 8 ユーザー・インタフェイス再び
origin: /sql/creating-a-database/
---
#  Lesson 7 SQL

## 1. データベースを作成する

SQL データベースを作成するためには、最初に適切な資格を持ったユーザーが必要です。
そのユーザーの名前とパスワードはプロパティに保存されますので、
何らかの通常の UI 要素やカスタム・アクションを使って、設定することが出来ます。
これは、[新しいユーザー・アカウントを作成する](/ch06/08-new-user-on-the-block.html) ために使ったのと同じ
**User** タグであることに注意して下さい。
ただし、そのときは、**Component** タグの中で使われていました。
どのコンポーネントにも属さないときは、User タグはユーザーを作成せず、他の操作が必要とする資格を定義するだけです。
ここで使うタグも、SQL 関連の機能も、拡張モジュールの中にありますので、ソース・ファイルの開始タグの中で、
それらの拡張モジュールに言及しなければなりません。

{% highlight xml %}
<Wix xmlns='http://schemas.microsoft.com/wix/2006/wi'
     xmlns:util='http://schemas.microsoft.com/wix/UtilExtension'
     xmlns:sql='http://schemas.microsoft.com/wix/SqlExtension'>
{% endhighlight %}

更に、それらのタグは独自のネームスペースに属していますので、使用するときには修飾を加えなければなりません。

{% highlight xml %}
<util:User Id='SQLUser' Name='[SQLUSER]' Password='[SQLPASSWORD]' />
{% endhighlight %}

データベースの作成そのものは、いつものように、コンポーネントの中に入ります。
**SqlDatabase** は前の **User** の宣言を参照し、データベース名 (サーバーとインスタンス) を定義します。
**Server** を指定しない場合は、ターゲット・マシンで走っている SQL サーバーにデータベースをインストールすることになります。
その他の属性は、さまざまに異なる状況で、どのように進むべきかを指定します。
**ConfirmOverwrite** は、データベースが既に存在する場合にどうするかを決定し、
**CreateOnInstall**, **CreateOnUninstall**, **DropOnInstall**, **DropOnUninstall**
の属性はインストールおよびアンインストールの際に要求される振る舞いを指図します。

入れ子にされた **SqlScript** タグは、作成されたばかりの空のデータベースに対して何をするべきかを決定します。
私たちは、ここで、独立したファイルに入っている SQL スクリプトを、妥当なものなら何でも、実行することが出来ます。
**BinaryKey** 属性が .sql ファイルへのリンクを提供します。
その他の属性は、エラーが発生したときの振る舞いを指定したり (ContinueOnError)、
スクリプトを実行する時を指定したりします
(**ExecuteOnInstall**, **ExecuteOnUninstall**, **RollbackOnInstall**, **RollbackOnUninstall**)。
実行されるスクリプトが複数有る場合は、**Sequence** 属性を使って、実行の順序を指定する事が出来ます。

{% highlight xml %}
<Component Id='SqlComponent' 
    Guid='YOURGUID-D8C7-4102-BA84-9702188FA316'>
  <sql:SqlDatabase Id='SqlDatabase' Database='Foobar'
      User='SQLUser' Server='[SQLSERVER]' CreateOnInstall='yes'
      DropOnUninstall='yes' ContinueOnError='yes'>
    <sql:SqlScript Id='CreateTable' BinaryKey='CreateTable'
        ExecuteOnInstall='yes' />
  </sql:SqlDatabase>
</Component>
{% endhighlight %}

残っているのは、`.sql` ファイルを含めることだけです。

{% highlight xml %}
<Binary Id='CreateTable' SourceFile='CreateTable.sql' />
{% endhighlight %}

参照する `.sql` ファイルは、データベース・テーブルを作成するためのよくある SQL コマンドを記載したものです。

{% highlight sql %}
CREATE TABLE Test (Value1 CHAR(50), Value2 INTEGER)
CREATE INDEX TestIndex ON Test (Value1)
{% endhighlight %}

インストーラ・パッケージをビルドする時は、適切な WiX モジュールとリンクしなければなりません。

{% highlight bat %}
candle.exe -ext WixUtilExtension -ext WixSqlExtension SampleSQL.wxs
light.exe -ext WixUtilExtension -ext WixSqlExtension SampleSQL.wixobj
{% endhighlight %}

完全な [SampleSQL](https://www.firegiant.com/system/files/samples/SampleSQL.zip) をダウンロードすることが出来ます。

> 訳註：SampleSQL の日本語版は [Sample-7-1-SQL.zip](/samples/Sample-7-1-SQL.zip) です。