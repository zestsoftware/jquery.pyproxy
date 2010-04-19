from setuptools import setup, find_packages
import sys, os

def get_file_contents(filename):
    file_path = os.path.join(filename)
    this_file = open(file_path)
    contents = this_file.read().strip()
    this_file.close()
    return contents

version = get_file_contents('jquery/pyproxy/version.txt')
history = get_file_contents('jquery/pyproxy/HISTORY.txt')
readme = get_file_contents('README.txt')
long = "%s\n\n\n%s" % (readme, history)

setup(name='jquery.pyproxy',
      version=version,
      description="A simple python egg and jquery plugin to easily use JQuery in Django/Plone/.. websites.",
      long_description=long,
      classifiers=[], # Get strings from http://pypi.python.org/pypi?%3Aaction=list_classifiers
      keywords='',
      author='Vincent Pretre',
      author_email='vincent.pretre@gmail.com',
      url='',
      license='GPL',
      packages=find_packages(exclude=['ez_setup', 'examples', 'tests']),
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          # -*- Extra requirements: -*-
      ],
      entry_points="""
      # -*- Entry points: -*-
      """,
      )
