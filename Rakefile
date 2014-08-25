task :deploy do
  dot_git = File.expand_path(File.join(File.dirname(__FILE__), ".git"))
  system "git --git-dir #{dot_git} remote update origin"
  system "git --git-dir #{dot_git} reset --hard origin/master"
  system "bundle install"
  system "bundle exec jekyll build"
end
