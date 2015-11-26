---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 1 始めよう / 7. ファイルだけでなく
current: ch01-07
prev: 06-conditional-installation
prev-title: 条件付きインストール
next: 08-orphaned-on-removal
next-title: 削除時の孤児化
origin: /getting-started/beyond-files/
---
# Lesson 1 始めよう

## 7. ファイルだけでなく

外の実世界では、おそらく、最終的な格納場所にファイルをコピーするだけでなく、より多くのことが必要になってくるでしょう。
レジストリのエントリーを作成するためには、コンポーネントの中に **RegistyKey** 要素を含めます。

{% highlight xml %}
<RegistryKey Id='HogeRegInstallDir'
    Root='HKLM' Key='Software\Piyo\Hoge 1.0' 
    Action='createAndRemoveOnUninstall'>
  <RegistryValue Type='string' Name='InstallDir'
      Value='[INSTALLDIR]'/>
  <RegistryValue Type='integer' Name='Flag' Value='0'/>
</RegistryKey>
{% endhighlight %}

**Action** 属性は、*create* または *createKeyAndRemoveKeyOnUninstall* です。
そして **Type** は、*string*, *integer*, *binary*, *expandable* および *multiString* のどれかです。
**Name** 属性が省略された場合は、`default` キーが作成されます。

*multiString* の場合は、一つまたは複数の **RegistryValue** を子要素に使って、それぞれの文字列を定義します。

{% highlight xml %}
<RegistryKey Id='HogeRegInstallDir'
    Root='HKLM' Key='Software\Piyo\Hoge 1.0'
    Action='createAndRemoveOnUninstall'>
  <RegistryValue Type='multiString' Name='InstallDir'
      Value='[TARGETDIR]'/>
  <RegistryValue Type='multiString' Name='InstallDir'
      Value='[INSTALLDIR]' 
      Action='append'/>
  <RegistryValue Type='multiString' Name='InstallDir'
      Value='[ProgramFilesFolder]' 
      Action='append'/>
</RegistryKey>
{% endhighlight %}

アプリケーションが固有のファイル・データ・タイプを扱う場合は、そのためにファイルの関連付けを登録する必要があります。
**ProgId** をコンポーネントの中に含めます。
そして、**FileId** で、この拡張子のファイルを取り扱うように意図されているファイルを記述する **File** 要素の **Id** を参照するようにします。

{% highlight xml %}
<ProgId Id='PiyoHoge.xyzfile' 
    Description='ぴよソフト ほげ データ・ファイル'>
  <Extension Id='xyz' ContentType='application/xyz'>
    <Verb Id='open' Command='Open'
         TargetFile='FileId' Argument='"%1"' />
  </Extension>
</ProgId>
{% endhighlight %}

このファイル・タイプにアイコンを割り当てるためには、アイコンをどこから取得すべきかを定義しなければなりません。

{% highlight xml %}
<ProgId Id='PiyoHoge.xyzfile'
    Description='ぴよソフト ほげ データ・ファイル'
    Icon='Hoge.ico'>
{% endhighlight %}

また、複数のアイコンを持つ実行ファイルやリソース・ファイルからアイコンを取得する場合は、どのアイコンであるかを指定することが出来ます。

{% highlight xml %}
<ProgId Id='PiyoHoge.xyzfile'
    Description='ぴよソフト ほげ データ・ファイル'
    Icon='Hoge.exe' IconIndex='1'>
{% endhighlight %}

そして最後に、.ini ファイルを書きたい場合は — 今日ではレジストリの方が人気がありますが — コンポーネントの中に次のように書きます。
.ini ファイルは、インストールの対象フォルダではなく、常にシステム・フォルダの中に作成されます。

{% highlight xml %}
<IniFile Id="WriteIntoIniFile" Action="addLine" Key="InstallDir"
    Name="Hoge.ini" Section="Paths" Value="[INSTALLDIR]" />
{% endhighlight %}

次のレッスンでは、ユーザーが何をどこへインストールするかを決める機会を得ることが出来るように、ユーザー・インタフェイスを実装する方法を調べます。