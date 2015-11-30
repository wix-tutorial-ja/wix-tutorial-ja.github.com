---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 1 始めよう / 5. どこにインストールするか
chapter: ch01
current: ch01-05
prev: 04-useful-extras
prev-title: 4. 便利な追加機能
next: 06-conditional-installation
next-title: 条件付きインストール
origin: /getting-started/where-to-install/
---
# Lesson 1 始めよう

## 5. どこにインストールするか

単独で動作するアプリケーションは、`Program Files` 以下の自分自身のフォルダにインストールされます — 
どうやってそれを実現するかは既に見たとおりです。
しかし、プラグインやアドオンに類する追加的な製品、すなわち、単独での使用を意図せず、
既にシステムにインストールされている他のプログラム(あなた自身のものであるか他の第三者のものであるかは問いません)
に付属させて使う製品の場合は、いつ、そして、どこにインストールするべきかをまず知らなければなりません。
この情報をユーザーに提供するように求めることは、エレガントでないのと同時に、おそらく多くの場合は危険でもあるでしょう。
そのため、何をなすべきかを決定するために、レジストリに問い合わせたり、既にシステムに存在している `.ini` ファイルを調べたり、
あるいは実際のフォルダやファイルを探す方法が必要になります。

これらの項目を検索する場合、結果はプロパティ(文字列変数)に保存されます。
従って、プロパティを定義することから始めます
(ここで使う *Id* が、最初のサンプルでインストール先のフォルダを意味するものとして使った名前と同じものであることに注意して下さい)。
*Property* タグの中で、レジストリ・サーチを実行します。それぞれの属性の意味は自ずから明らかでしょう。

{% highlight xml %}
<Property Id="INSTALLDIR">
  <RegistrySearch Id='PiyoHogeRegistry' Type='raw'
      Root='HKLM' Key='Software\Piyo\Hoge 1.0' Name='InstallDir' />
</Property>
{% endhighlight %}

レジストリ・サーチが成功した場合(すなわち、指定されたレジストリ・エントリが実際に存在している場合)は、
その値が **INSTALLDIR** プロパティに割り当てられ、私たちの目的に使用することが出来るようになります。
このことを確認するために、上記の行を最初のサンプルの *Media* タグの後ろに追加して、`SampleRegistry.wxs` として保存します
(または、前と同じように、[SampleRegistry](https://www.firegiant.com/system/files/samples/SampleRegistry.zip) をダウンロードします)。
コンパイルした後、インストールを開始する前に、レジストリに入って `HKEY_LOCAL_MACHINE\SOFTWARE\Piyo\Hoge 1.0` キーを作成して下さい。
そして、`InstallDir` という名前の文字列値を新規作成して、システム上のどこかに作成した空っぽのフォルダを指すように設定します。
それから、ロギングを有効にしてインストーラを走らせて下さい。

> 訳註：SampleRegistry の日本語版は [Sample-1-5-Registry.zip](/samples/Sample-1-3-First.zip) です。

すべて間違い無く出来ていれば、三つのサンプル・ファイルがこの新しいフォルダの中に出現します。
また、(スタート・メニューとデスクトップにある)ショートカットも、今度は、この新しい場所を指し示すようになっていることも注目して下さい。

同様の情報が他のソースから来る場合もあります。
`\Windows\SampleRegistry.ini` が以下のようになっていると仮定しましょう
(システム・フォルダにあるこのようなファイルは、読み出すことしか出来ません)。

{% highlight ini %}
[Sample]
InstallDir=C:\InstallHere
{% endhighlight %}

前のセクションを以下の新しいものに置き換えます。

{% highlight xml %}
<Property Id="INSTALLDIR">
  <IniFileSearch Id='PiyoHogeIniFile' Type='directory'
       Name='SampleRegistry.ini' Section='Sample' Key='InstallDir' />
</Property>
{% endhighlight %}

場合によっては、単にフォルダ名を知るだけでは十分でなく、フォルダの中を見て、
指定されたファイルがそこに存在することを確認しなければならないこともあります。
*Depth = n* を使うと、指定された *Path* から **n** レベル下まで探すように、インストーラに指示を与えることが出来ます。
*Depth* 属性がゼロであるか、省略されている場合は、指定されたフォルダの中だけで探す(サブフォルダは見ない)ことを意味します。
*Path* の中で角括弧を使って、インストーラに **INSTALLDIR** プロパティの**値**を使うように指示しています — 
角括弧で囲まれた名前は検索されて、見つかれば、実際の値で置き換えられます。
見つからなかった場合は、文字列はそのまま変更されません。

{% highlight xml %}
<Property Id="FILEEXISTS">
  <DirectorySearch Id="CheckFileDir" Path="[INSTALLDIR]" Depth="0">
    <FileSearch Id="CheckFile" Name="Lookfor.txt" />
  </DirectorySearch>
</Property>
{% endhighlight %}

もしファイルが見つかれば、そのフル・パスが **FILEEXISTS** プロパティに割り当てられます。
そうでなければ、FILEEXISTS プロパティは、割り当てられないままになります。
このサンプル(前の *RegistrySearch* と、この断片の両方が必要になります)をビルドして、ロギングを有効にして走らせてみると、このことが確認出来ます。
レジストリで指定したフォルダに `Lookfor.txt` を置いてから走らせると、ログの中に、
ファイルのフル・パスを値として持つ **FILEEXISTS** への参照が出てくるようになります。

私たちはまだユーザー・インタフェイスを持っていませんが、
ユーザーとの何らかの相互作用から値を受け取ってインストール・ロジックに引き渡すためのプロパティ
(ユーザーが選択するインストール先フォルダや機能を示すプロパティなど)は、
**public** なプロパティである必要がある、ということは、もう覚えておいても良いでしょう。
プロパティを public なものにするためには、名前を全て大文字にする必要があります。

同時に、Windows Installer は、製品をアップグレードするための方法として、
以前のインストールの特定のレジストリ・エントリを探すよりも、もっと良い方法を持っている、ということも知っておくべきです。
可能なときは常にそちらの機能を使用するべきです — しかし、説明がそこに行き着くまで、もう少し辛抱して下さい。